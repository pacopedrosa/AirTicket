<?php

namespace App\Repository;

use App\Entity\Flight;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Flight>
 */
class FlightRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Flight::class);
    }

    public function findByFilters(?string $origin, ?string $destination, ?string $date)
    {
        $qb = $this->createQueryBuilder('f');

        if ($origin) {
            $qb->andWhere('f.origin = :origin')
               ->setParameter('origin', $origin);
        }

        if ($destination) {
            $qb->andWhere('f.destination = :destination')
               ->setParameter('destination', $destination);
        }

        if ($date) {
            $dateStart = new \DateTime($date);
            $dateEnd = clone $dateStart;
            $dateEnd->modify('+1 day');

            $qb->andWhere('f.departure_date BETWEEN :dateStart AND :dateEnd')
               ->setParameter('dateStart', $dateStart)
               ->setParameter('dateEnd', $dateEnd);
        }

        return $qb->getQuery()->getResult();
    }

//    /**
//     * @return Flight[] Returns an array of Flight objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Flight
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
