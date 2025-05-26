<?php

namespace App\Repository;

use App\Repository\UserRepository;
use App\Repository\FlightRepository;
use App\Repository\ReservationsRepository;
use Doctrine\ORM\EntityManagerInterface;

class StatisticsRepository
{
    private $userRepository;
    private $flightRepository;
    private $reservationsRepository;

    public function __construct(
        UserRepository $userRepository,
        FlightRepository $flightRepository,
        ReservationsRepository $reservationsRepository
    ) {
        $this->userRepository = $userRepository;
        $this->flightRepository = $flightRepository;
        $this->reservationsRepository = $reservationsRepository;
    }

    public function getStatistics(): array
    {
        // Mes actual
        $startOfMonth = new \DateTime('first day of this month midnight');
        $endOfMonth = new \DateTime('last day of this month 23:59:59');

        // Mes anterior
        $startOfLastMonth = (clone $startOfMonth)->modify('-1 month');
        $endOfLastMonth = (clone $endOfMonth)->modify('-1 month');

        // Ingresos mensuales (actual)
        $monthlyRevenue = $this->reservationsRepository->createQueryBuilder('r')
            ->select('SUM(r.total_price)')
            ->where('r.state = :state')
            ->andWhere('r.reservation_date BETWEEN :start AND :end')
            ->setParameter('state', 'CONFIRMED')
            ->setParameter('start', $startOfMonth)
            ->setParameter('end', $endOfMonth)
            ->getQuery()
            ->getSingleScalarResult() ?? 0;

        // Ingresos mensuales (anterior)
        $lastMonthRevenue = $this->reservationsRepository->createQueryBuilder('r')
            ->select('SUM(r.total_price)')
            ->where('r.state = :state')
            ->andWhere('r.reservation_date BETWEEN :start AND :end')
            ->setParameter('state', 'CONFIRMED')
            ->setParameter('start', $startOfLastMonth)
            ->setParameter('end', $endOfLastMonth)
            ->getQuery()
            ->getSingleScalarResult() ?? 0;

        // Vuelos activos (actual)
        $activeFlights = $this->flightRepository->createQueryBuilder('f')
            ->select('COUNT(f)')
            ->where('f.departure_date >= :now')
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getSingleScalarResult();

        // Vuelos activos (anterior: vuelos que partieron el mes pasado)
        $lastMonthFlights = $this->flightRepository->createQueryBuilder('f')
            ->select('COUNT(f)')
            ->where('f.departure_date BETWEEN :start AND :end')
            ->setParameter('start', $startOfLastMonth)
            ->setParameter('end', $endOfLastMonth)
            ->getQuery()
            ->getSingleScalarResult();

        // Reservas totales (actual)
        $totalReservations = $this->reservationsRepository->count(['state' => 'CONFIRMED']);

        // Reservas totales (mes anterior)
        $lastMonthReservations = $this->reservationsRepository->createQueryBuilder('r')
            ->select('COUNT(r)')
            ->where('r.state = :state')
            ->andWhere('r.reservation_date BETWEEN :start AND :end')
            ->setParameter('state', 'CONFIRMED')
            ->setParameter('start', $startOfLastMonth)
            ->setParameter('end', $endOfLastMonth)
            ->getQuery()
            ->getSingleScalarResult();

        // Usuarios totales (actual)
        $totalUsers = $this->userRepository->count([]);

        // Usuarios totales (anterior: asumimos que no hay campo created_at, así que usamos el mismo conteo)
        $lastMonthUsers = $totalUsers; // Sin created_at, no podemos saber nuevos usuarios del mes pasado

        return [
            'current' => [
                'monthlyRevenue' => (float)$monthlyRevenue,
                'activeFlights' => (int)$activeFlights,
                'totalReservations' => (int)$totalReservations,
                'totalUsers' => (int)$totalUsers
            ],
            'previous' => [
                'monthlyRevenue' => (float)$lastMonthRevenue,
                'activeFlights' => (int)$lastMonthFlights,
                'totalReservations' => (int)$lastMonthReservations,
                'totalUsers' => (int)$lastMonthUsers
            ]
        ];
    }

    public function getActivityData(\DateTime $startDate, \DateTime $endDate): array
    {
        $qb = $this->reservationsRepository->createQueryBuilder('r')
            ->select('DATE(r.reservation_date) as date')
            ->addSelect('COUNT(r.id) as bookings')
            ->addSelect('SUM(r.total_price) as revenue')
            ->where('r.reservation_date BETWEEN :start AND :end')
            ->setParameter('start', $startDate->format('Y-m-d'))
            ->setParameter('end', $endDate->format('Y-m-d'))
            ->groupBy('date')
            ->orderBy('date', 'ASC');

        return $qb->getQuery()->getResult();
    }
} 