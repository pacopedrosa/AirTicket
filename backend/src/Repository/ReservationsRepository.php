<?php

namespace App\Repository;

use App\Entity\Reservations;
use App\Entity\User;
use App\Entity\Flight;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ReservationsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reservations::class);
    }

    public function findTopTraveler(User $user): array
    {
        try {
            return [
                'name' => $user->getFullName() ?? $user->getUsername(), // Use full name, fallback to username
                'total_flights' => $this->count(['user' => $user])
            ];
        } catch (\Exception $e) {
            return ['name' => 'N/A', 'total_flights' => 0];
        }
    }

    public function findMostPopularDestination(User $user): array
    {
        try {
            $result = $this->createQueryBuilder('r')
                ->select('f.destination as city, COUNT(r.id) as total_bookings')
                ->join(Flight::class, 'f', 'WITH', 'r.flight = f')
                ->where('r.user = :user')
                ->setParameter('user', $user)
                ->groupBy('f.destination')
                ->orderBy('total_bookings', 'DESC')
                ->setMaxResults(1)
                ->getQuery()
                ->getOneOrNullResult();

            return $result ?: ['city' => 'N/A', 'total_bookings' => 0];
        } catch (\Exception $e) {
            return ['city' => 'N/A', 'total_bookings' => 0];
        }
    }

    public function calculateTotalCarbonOffset(User $user): float
    {
        try {
            $result = $this->createQueryBuilder('r')
                ->select('COUNT(r.id) * 115.6 as total_offset')
                ->where('r.user = :user')
                ->setParameter('user', $user)
                ->getQuery()
                ->getSingleScalarResult();

            return round((float) $result, 2);
        } catch (\Exception $e) {
            return 0.0;
        }
    }

    // Add these methods to your existing ReservationsRepository class

    public function findRecentBookings(int $limit): array
    {
        return $this->createQueryBuilder('r')
            ->orderBy('r.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    // public function findPaginated(int $page, int $limit): array
    // {
    //     $offset = ($page - 1) * $limit;

    //     return $this->createQueryBuilder('r')
    //         ->orderBy('r.createdAt', 'DESC')
    //         ->setFirstResult($offset)
    //         ->setMaxResults($limit)
    //         ->getQuery()
    //         ->getResult();
    // }
    public function findPaginated(int $page, int $limit): array
    {
        try {
            $page = max(1, $page); // Asegura que la página sea al menos 1
            $limit = max(1, $limit); // Asegura que el límite sea al menos 1

            // Obtener usuarios para la página actual
            $query = $this->createQueryBuilder('u')
                ->select('u')
                ->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit)
                ->getQuery();

            $users = $query->getResult();

            // Contar el total de usuarios
            $totalCount = $this->createQueryBuilder('u')
                ->select('COUNT(u.id)')
                ->getQuery()
                ->getSingleScalarResult();

            return [
                'items' => $users,
                'totalPages' => ceil($totalCount / $limit)
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al obtener usuarios paginados: ' . $e->getMessage());
        }
    }
}
