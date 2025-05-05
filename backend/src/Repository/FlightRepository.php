<?php

namespace App\Repository;

use App\Entity\Flight;
use App\Entity\User;
use App\Entity\Reservations;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

class FlightRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Flight::class);
    }

    public function findByFilters(?string $origin = null, ?string $destination = null, ?string $date = null)
    {
        $qb = $this->createQueryBuilder('f');

        // Handle date filtering if provided
        if ($date) {
            $dateStart = new \DateTime($date);
            $dateEnd = clone $dateStart;
            $dateEnd->modify('+1 day');

            $qb->andWhere('f.departure_date BETWEEN :dateStart AND :dateEnd')
               ->setParameter('dateStart', $dateStart)
               ->setParameter('dateEnd', $dateEnd);
        }

        // Handle origin filtering if provided
        if ($origin) {
            $qb->andWhere('f.origin = :origin')
               ->setParameter('origin', $origin);
        }

        // Handle destination filtering if provided
        if ($destination) {
            $qb->andWhere('f.destination = :destination')
               ->setParameter('destination', $destination);
        }

        // Always order by departure date
        $qb->orderBy('f.departure_date', 'ASC');

        return $qb->getQuery()->getResult();
    }

    public function findByDateRange($origin, $destination, $date)
    {
        $qb = $this->createQueryBuilder('f')
            ->where('f.origin = :origin')
            ->andWhere('f.destination = :destination')
            ->andWhere('DATE(f.departure_date) = :date')
            ->setParameter('origin', $origin)
            ->setParameter('destination', $destination)
            ->setParameter('date', $date)
            ->orderBy('f.departure_date', 'ASC');

        return $qb->getQuery()->getResult();
    }

    public function calculateAverageDuration(User $user): float
    {
        try {
            $result = $this->createQueryBuilder('f')
                ->select('AVG(TIMESTAMPDIFF(HOUR, f.departure_date, f.arrival_date)) as avg_duration')
                ->join(Reservations::class, 'r', 'WITH', 'r.flight = f')
                ->where('r.user = :user')
                ->setParameter('user', $user)
                ->getQuery()
                ->getSingleScalarResult();

            return $result ? round((float) $result, 2) : 0.0;
        } catch (\Exception $e) {
            return 0.0;
        }
    }

    // Add these methods to your existing FlightRepository class

    public function countActiveFlights(): int
    {
        return $this->createQueryBuilder('f')
            ->select('COUNT(f.id)')
            ->where('f.date >= :today')
            ->setParameter('today', new \DateTime())
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findPaginated(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('f')
            ->orderBy('f.date', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
