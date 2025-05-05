<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Repository\FlightRepository;
use App\Repository\ReservationsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Psr\Log\LoggerInterface;

#[Route('/api/admin')]
class AdminController extends AbstractController
{
    private $userRepository;
    private $flightRepository;
    private $reservationsRepository;
    private LoggerInterface $logger;

    public function __construct(
        UserRepository $userRepository,
        FlightRepository $flightRepository,
        ReservationsRepository $reservationsRepository,
        LoggerInterface $logger
    ) {
        $this->userRepository = $userRepository;
        $this->flightRepository = $flightRepository;
        $this->reservationsRepository = $reservationsRepository;
        $this->logger = $logger;
    }

    #[Route('/statistics', name: 'admin_statistics', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getStatistics(): JsonResponse
    {
        try {
            $startOfMonth = new \DateTime('first day of this month midnight');
            $endOfMonth = new \DateTime('last day of this month 23:59:59');

            $monthlyRevenue = $this->reservationsRepository->createQueryBuilder('r')
                ->select('SUM(r.total_price)')
                ->where('r.state = :state')
                ->andWhere('r.reservation_date BETWEEN :start AND :end')
                ->setParameter('state', 'CONFIRMED')
                ->setParameter('start', $startOfMonth)
                ->setParameter('end', $endOfMonth)
                ->getQuery()
                ->getSingleScalarResult() ?? 0;

            $activeFlights = $this->flightRepository->createQueryBuilder('f')
                ->select('COUNT(f)')
                ->where('f.departure_date >= :now')
                ->setParameter('now', new \DateTime())
                ->getQuery()
                ->getSingleScalarResult();

            $totalReservations = $this->reservationsRepository->count(['state' => 'CONFIRMED']);
            $totalUsers = $this->userRepository->count([]);

            return $this->json([
                'totalUsers' => $totalUsers,
                'activeFlights' => $activeFlights,
                'totalReservations' => $totalReservations,
                'monthlyRevenue' => (float)$monthlyRevenue
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Error al obtener estadísticas: ' . $e->getMessage(), ['exception' => $e]);
            return $this->json(['error' => 'Error al obtener estadísticas'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/users', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $this->logger->info('Iniciando getUsers', ['page' => $request->query->getInt('page', 1)]);

            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 10);
            
            $users = $this->userRepository->findPaginated($page, $limit);
            
            if (!isset($users['items']) || !isset($users['totalPages'])) {
                $this->logger->error('Estructura inválida devuelta por findPaginated', ['users' => $users]);
                throw new \Exception('Estructura de datos inválida en findPaginated');
            }

            $this->logger->info('Usuarios obtenidos', ['count' => count($users['items'])]);

            return new JsonResponse([
                'items' => array_map(function ($user) {
                    try {
                        return [
                            'id' => $user->getId(),
                            'username' => $user->getUsername() ?? 'N/A',
                            'email' => $user->getEmail() ?? 'N/A',
                            'roles' => is_array($user->getRoles()) ? $user->getRoles() : ['N/A'],
                            'createdAt' => method_exists($user, 'getCreatedAt') && $user->getCreatedAt() 
                                ? $user->getCreatedAt()->format('Y-m-d H:i:s') 
                                : 'N/A'
                        ];
                    } catch (\Exception $e) {
                        $this->logger->error('Error al procesar usuario: ' . $e->getMessage(), ['user_id' => $user->getId()]);
                        return null;
                    }
                }, $users['items']),
                'totalPages' => $users['totalPages']
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Error en getUsers: ' . $e->getMessage(), ['exception' => $e]);
            return $this->json(['error' => 'Error al obtener usuarios: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/flights', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getFlights(Request $request): JsonResponse
    {
        try {
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 10);
            
            $flights = $this->flightRepository->findPaginated($page, $limit);
            return new JsonResponse([
                'items' => array_map(function ($flight) {
                    return [
                        'id' => $flight->getId(),
                        'flightNumber' => $flight->getFlightNumber(),
                        'origin' => $flight->getOrigin(),
                        'destination' => $flight->getDestination(),
                        'departureDate' => $flight->getDepartureDate() 
                            ? $flight->getDepartureDate()->format('Y-m-d H:i:s') 
                            : 'N/A'
                    ];
                }, $flights['items']),
                'totalPages' => $flights['totalPages']
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Error al obtener vuelos: ' . $e->getMessage(), ['exception' => $e]);
            return $this->json(['error' => 'Error al obtener vuelos'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/reservations', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getReservations(Request $request): JsonResponse
    {
        try {
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 10);
            
            $reservations = $this->reservationsRepository->findPaginated($page, $limit);
            return new JsonResponse([
                'items' => array_map(function ($reservation) {
                    return [
                        'id' => $reservation->getId(),
                        'username' => $reservation->getUser() ? $reservation->getUser()->getUsername() : 'N/A',
                        'flightNumber' => $reservation->getFlight() ? $reservation->getFlight()->getFlightNumber() : 'N/A',
                        'status' => $reservation->getState(),
                        'totalPrice' => $reservation->getTotalPrice(),
                        'reservationDate' => $reservation->getReservationDate() 
                            ? $reservation->getReservationDate()->format('Y-m-d H:i:s') 
                            : 'N/A'
                    ];
                }, $reservations['items']),
                'totalPages' => $reservations['totalPages']
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Error al obtener reservas: ' . $e->getMessage(), ['exception' => $e]);
            return $this->json(['error' => 'Error al obtener reservas'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/dashboard/recent-bookings', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getRecentBookings(): JsonResponse
    {
        try {
            $user = $this->getUser();
            if (!$user) {
                return $this->json(['error' => 'Usuario no autenticado'], JsonResponse::HTTP_UNAUTHORIZED);
            }

            $recentBookings = $this->reservationsRepository->findBy(
                [], 
                ['id' => 'DESC'],
                10
            );

            $bookingsData = array_map(function($booking) {
                return [
                    'id' => $booking->getId(),
                    'username' => $booking->getUser() ? $booking->getUser()->getUsername() : 'N/A',
                    'flightNumber' => $booking->getFlight() ? $booking->getFlight()->getFlightNumber() : 'N/A',
                    'status' => $booking->getState(),
                    'totalPrice' => $booking->getTotalPrice(),
                    'origin' => $booking->getFlight() ? $booking->getFlight()->getOrigin() : 'N/A',
                    'destination' => $booking->getFlight() ? $booking->getFlight()->getDestination() : 'N/A'
                ];
            }, $recentBookings);

            return $this->json($bookingsData);
        } catch (\Exception $e) {
            $this->logger->error('Error al obtener reservas recientes: ' . $e->getMessage(), ['exception' => $e]);
            return $this->json(['error' => 'Error al obtener reservas recientes'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/dashboard/activity', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getDashboardActivity(): JsonResponse
    {
        try {
            $endDate = new \DateTime();
            $startDate = (clone $endDate)->modify('-6 days');
            
            $qb = $this->reservationsRepository->createQueryBuilder('r')
                ->select('DATE(r.reservation_date) as date')
                ->addSelect('COUNT(r.id) as bookings')
                ->addSelect('SUM(r.total_price) as revenue')
                ->where('r.reservation_date BETWEEN :start AND :end')
                ->setParameter('start', $startDate->format('Y-m-d'))
                ->setParameter('end', $endDate->format('Y-m-d'))
                ->groupBy('date')
                ->orderBy('date', 'ASC');
    
            $results = $qb->getQuery()->getResult();
    
            $dates = [];
            $bookingsData = [];
            $revenueData = [];
    
            for ($i = 6; $i >= 0; $i--) {
                $date = (clone $endDate)->modify("-$i days");
                $dateStr = $date->format('Y-m-d');
                $dates[] = $date->format('M d');
                $bookingsData[$dateStr] = 0;
                $revenueData[$dateStr] = 0;
            }
    
            foreach ($results as $result) {
                $dateStr = $result['date'];
                if (isset($bookingsData[$dateStr])) {
                    $bookingsData[$dateStr] = (int)$result['bookings'];
                    $revenueData[$dateStr] = (float)$result['revenue'];
                }
            }
    
            return $this->json([
                'labels' => $dates,
                'bookings' => array_values($bookingsData),
                'revenue' => array_values($revenueData)
            ]);
    
        } catch (\Exception $e) {
            $this->logger->error('Error al obtener datos de actividad: ' . $e->getMessage(), ['exception' => $e]);
            return $this->json(['error' => 'Error al obtener datos de actividad'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/dashboard', name: 'admin_dashboard', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getDashboardStats(
        UserRepository $userRepository,
        FlightRepository $flightRepository,
        ReservationsRepository $reservationsRepository
    ): JsonResponse
    {
        try {
            $this->logger->info('Iniciando getDashboardStats');

            // Total usuarios (excluyendo admin)
            $totalUsers = $userRepository->createQueryBuilder('u')
                ->select('COUNT(u)')
                ->where('u.roles NOT LIKE :role')
                ->setParameter('role', '%ROLE_ADMIN%')
                ->getQuery()
                ->getSingleScalarResult();
            $this->logger->info('Total usuarios obtenido: ' . $totalUsers);

            // Vuelos activos
            $activeFlights = $flightRepository->createQueryBuilder('f')
                ->select('COUNT(f)')
                ->where('f.departure_date > :now')
                ->setParameter('now', new \DateTime())
                ->getQuery()
                ->getSingleScalarResult();
            $this->logger->info('Vuelos activos obtenidos: ' . $activeFlights);

            // Total reservas
            $totalReservations = $reservationsRepository->count([]);
            $this->logger->info('Total reservas obtenidas: ' . $totalReservations);

            // Ingresos mensuales
            $startOfMonth = new \DateTime('first day of this month midnight');
            $endOfMonth = new \DateTime('last day of this month 23:59:59');
            
            $monthlyRevenue = $reservationsRepository->createQueryBuilder('r')
                ->select('SUM(r.total_price)')
                ->where('r.reservation_date BETWEEN :start AND :end')
                ->andWhere('r.state = :state')
                ->setParameter('start', $startOfMonth)
                ->setParameter('end', $endOfMonth)
                ->setParameter('state', 'CONFIRMED')
                ->getQuery()
                ->getSingleScalarResult() ?? 0;
            $this->logger->info('Ingresos mensuales obtenidos: ' . $monthlyRevenue);

            // Reservas recientes
            $recentBookings = $reservationsRepository->createQueryBuilder('r')
                ->select('r', 'f', 'u')
                ->leftJoin('r.flight', 'f')
                ->leftJoin('r.user', 'u')
                ->orderBy('r.reservation_date', 'DESC')
                ->setMaxResults(10)
                ->getQuery()
                ->getResult();
            $this->logger->info('Reservas recientes obtenidas: ' . count($recentBookings));

            $bookingsData = array_map(function($booking) {
                try {
                    return [
                        'id' => $booking->getId(),
                        'username' => $booking->getUser() ? $booking->getUser()->getUsername() : 'N/A',
                        'flightNumber' => $booking->getFlight() ? $booking->getFlight()->getFlightNumber() : 'N/A',
                        'origin' => $booking->getFlight() ? $booking->getFlight()->getOrigin() : 'N/A',
                        'destination' => $booking->getFlight() ? $booking->getFlight()->getDestination() : 'N/A',
                        'status' => $booking->getState(),
                        'totalPrice' => $booking->getTotalPrice(),
                        'createdAt' => $booking->getReservationDate() ? $booking->getReservationDate()->format('Y-m-d H:i:s') : 'N/A'
                    ];
                } catch (\Exception $e) {
                    $this->logger->error('Error al procesar reserva: ' . $e->getMessage(), ['booking_id' => $booking->getId()]);
                    return null;
                }
            }, $recentBookings);

            // Filtrar reservas nulas (en caso de errores)
            $bookingsData = array_filter($bookingsData);

            return $this->json([
                'totalUsers' => (int)$totalUsers,
                'activeFlights' => (int)$activeFlights,
                'totalReservations' => (int)$totalReservations,
                'monthlyRevenue' => (float)$monthlyRevenue,
                'recentBookings' => array_values($bookingsData)
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Error en getDashboardStats: ' . $e->getMessage(), ['exception' => $e]);
            return $this->json(['error' => 'Error al obtener estadísticas del dashboard: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}