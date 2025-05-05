<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Psr\Log\LoggerInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    private LoggerInterface $logger;

    public function __construct(ManagerRegistry $registry, LoggerInterface $logger)
    {
        parent::__construct($registry, User::class);
        $this->logger = $logger;
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findPaginated(int $page, int $limit): array
    {
        try {
            $this->logger->info('Ejecutando findPaginated', ['page' => $page, 'limit' => $limit]);

            // Validar parámetros
            $page = max(1, $page);
            $limit = max(1, min(100, $limit)); // Limitar el máximo para evitar sobrecarga
            $offset = ($page - 1) * $limit;

            // Obtener usuarios para la página actual
            $query = $this->createQueryBuilder('u')
                ->select('u')
                ->orderBy('u.id', 'DESC')
                ->setFirstResult($offset)
                ->setMaxResults($limit)
                ->getQuery();

            $users = $query->getResult();

            // Contar el total de usuarios
            $totalCount = (int) $this->createQueryBuilder('u')
                ->select('COUNT(u.id)')
                ->getQuery()
                ->getSingleScalarResult();

            $totalPages = (int) ceil($totalCount / $limit);

            $this->logger->info('Usuarios paginados obtenidos', [
                'count' => count($users),
                'totalCount' => $totalCount,
                'totalPages' => $totalPages
            ]);

            return [
                'items' => $users,
                'totalPages' => $totalPages
            ];
        } catch (\Exception $e) {
            $this->logger->error('Error en findPaginated: ' . $e->getMessage(), ['exception' => $e]);
            throw new \Exception('Error al obtener usuarios paginados: ' . $e->getMessage());
        }
    }
}