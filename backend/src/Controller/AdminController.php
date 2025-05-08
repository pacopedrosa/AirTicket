<?php

namespace App\Controller;

use App\Entity\Flight;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\FlightRepository;
use App\Repository\ReservationsRepository;
use App\Repository\PayRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Psr\Log\LoggerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

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
        PayRepository $payRepository,
        LoggerInterface $logger
    ) {
        $this->userRepository = $userRepository;
        $this->flightRepository = $flightRepository;
        $this->payRepository = $payRepository;
        $this->reservationsRepository = $reservationsRepository;
        $this->logger = $logger;
    }

    #[Route('/statistics', name: 'admin_statistics', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getStatistics(): JsonResponse
    {
        try {
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

            return $this->json([
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
            $flights = $this->flightRepository->findAll();
            
            return new JsonResponse([
                'items' => array_map(function ($flight) {
                    try {
                        $departureDate = $flight->getDepartureDate();
                        $arrivalDate = $flight->getArrivalDate();
                        $basePrice = $flight->getBasePrice();

                        return [
                            'id' => $flight->getId(),
                            'flightNumber' => $flight->getFlightNumber(),
                            'origin' => $flight->getOrigin(),
                            'destination' => $flight->getDestination(),
                            'departureDate' => $departureDate instanceof \DateTime 
                                ? $departureDate->format('d/m/Y, H:i:s')
                                : $departureDate,
                            'arrivalDate' => $arrivalDate instanceof \DateTime 
                                ? $arrivalDate->format('d/m/Y, H:i:s')
                                : $arrivalDate,
                            'price' => $basePrice !== null ? number_format($basePrice, 2) : '0.00',
                            'actions' => ['delete']
                        ];
                    } catch (\Exception $e) {
                        $this->logger->error('Error procesando vuelo: ' . $e->getMessage(), [
                            'flight_id' => $flight->getId()
                        ]);
                        return null;
                    }
                }, $flights),
                'totalPages' => 1
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Error al obtener vuelos: ' . $e->getMessage(), ['exception' => $e]);
            return $this->json(['error' => 'Error al obtener vuelos'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/flights', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function createFlight(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $flight = new Flight();
            $flight->setFlightNumber($data['flightNumber']);
            $flight->setOrigin($data['origin']);
            $flight->setDestination($data['destination']);
            $flight->setDepartureDate(new \DateTime($data['departureDate']));
            $flight->setArrivalDate(new \DateTime($data['arrivalDate']));
            $flight->setBasePrice((int)$data['basePrice']);
            $flight->setTotalSeats((int)$data['totalSeats']);
            $flight->setSeatsAvailable((int)$data['totalSeats']); // Inicialmente, todos los asientos están disponibles

            $entityManager->persist($flight);
            $entityManager->flush();

            return $this->json([
                'message' => 'Vuelo creado exitosamente',
                'id' => $flight->getId()
            ], JsonResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            $this->logger->error('Error al crear vuelo: ' . $e->getMessage());
            return $this->json(['error' => 'Error al crear el vuelo'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/users', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function createUser(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            // Validación básica de datos requeridos
            if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
                return $this->json([
                    'error' => 'Faltan campos requeridos (username, email, password)'
                ], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Verificar si el usuario ya existe
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                return $this->json([
                    'error' => 'Ya existe un usuario con este email'
                ], JsonResponse::HTTP_CONFLICT);
            }

            $user = new User();
            $user->setUsername($data['username']);
            $user->setEmail($data['email']);
            $user->setFullName($data['fullName'] ?? '');
            $user->setPhone($data['phone'] ?? '');
            
            // Manejo seguro de la fecha de nacimiento
            if (isset($data['birthdate']) && $data['birthdate']) {
                try {
                    $user->setBirthdate(new \DateTime($data['birthdate']));
                } catch (\Exception $e) {
                    $this->logger->warning('Formato de fecha inválido', ['birthdate' => $data['birthdate']]);
                }
            }
            
            // Asignar roles (por defecto ROLE_USER si no se especifica)
            $roles = isset($data['roles']) && is_array($data['roles']) ? $data['roles'] : ['ROLE_USER'];
            $user->setRoles($roles);

            // Hashear la contraseña
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            $entityManager->persist($user);
            $entityManager->flush();

            $this->logger->info('Usuario creado exitosamente', ['user_id' => $user->getId()]);

            return $this->json([
                'message' => 'Usuario creado exitosamente',
                'id' => $user->getId()
            ], JsonResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            $this->logger->error('Error al crear usuario: ' . $e->getMessage(), [
                'exception' => $e,
                'data' => $data ?? null
            ]);
            return $this->json([
                'error' => 'Error al crear el usuario: ' . $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/flights/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteFlight(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $flight = $this->flightRepository->find($id);

            if (!$flight) {
                $this->logger->warning('Intento de eliminar vuelo no encontrado', ['flight_id' => $id]);
                return $this->json(['error' => 'Vuelo no encontrado'], JsonResponse::HTTP_NOT_FOUND);
            }

            // Verificar si el vuelo tiene reservas asociadas
            if ($flight->getReservations()->count() > 0) {
                $this->logger->warning('Intento de eliminar vuelo con reservas', ['flight_id' => $id]);
                return $this->json(['error' => 'No se puede eliminar un vuelo con reservas activas'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $entityManager->remove($flight);
            $entityManager->flush();

            $this->logger->info('Vuelo eliminado exitosamente', ['flight_id' => $id]);

            return $this->json(['message' => 'Vuelo eliminado exitosamente'], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            $this->logger->error('Error al eliminar vuelo: ' . $e->getMessage(), ['exception' => $e, 'flight_id' => $id]);
            return $this->json(['error' => 'Error al eliminar el vuelo'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
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

    #[Route('/reservations/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteReservation(int $id, EntityManagerInterface $entityManager, PayRepository $payRepository): JsonResponse
    {
        try {
            $reservation = $this->reservationsRepository->find($id);

            if (!$reservation) {
                $this->logger->warning('Intento de eliminar reserva no encontrada', ['reservation_id' => $id]);
                return $this->json(['error' => 'Reserva no encontrada'], JsonResponse::HTTP_NOT_FOUND);
            }

            // Buscar y eliminar el registro asociado en la tabla pay, si existe
            $pay = $payRepository->findOneBy(['reservation' => $reservation]);
            if ($pay) {
                $entityManager->remove($pay);
                $this->logger->info('Registro de pago eliminado', ['pay_id' => $pay->getId(), 'reservation_id' => $id]);
            }

            // Disociar la relación con passengers estableciendo passengers_id a NULL
            if ($reservation->getPassengers()) {
                $reservation->setPassengers(null);
                $this->logger->info('Relación con passengers disociada', ['reservation_id' => $id]);
            }

            // Eliminar la reserva
            $entityManager->remove($reservation);
            $entityManager->flush();

            $this->logger->info('Reserva eliminada exitosamente', ['reservation_id' => $id]);

            return $this->json(['message' => 'Reserva eliminada exitosamente'], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            $this->logger->error('Error al eliminar reserva: ' . $e->getMessage(), ['exception' => $e, 'reservation_id' => $id]);
            return $this->json(['error' => 'Error al eliminar la reserva: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
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

    #[Route('/deleteUser/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteUser(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $this->logger->info('Iniciando eliminación de usuario', ['user_id' => $id]);

            $user = $this->userRepository->find($id);
            if (!$user) {
                $this->logger->warning('Usuario no encontrado', ['user_id' => $id]);
                return $this->json(['error' => 'Usuario no encontrado'], JsonResponse::HTTP_NOT_FOUND);
            }

            // Obtener todas las reservas del usuario
            $reservations = $user->getReservations();
            $this->logger->info('Reservas encontradas para el usuario', [
                'user_id' => $id,
                'reservations_count' => $reservations->count()
            ]);

            // Eliminar registros relacionados
            foreach ($reservations as $reservation) {
                // Eliminar el registro Pay asociado, si existe
                $pay = $this->payRepository->findOneBy(['reservation' => $reservation]);
                if ($pay) {
                    $entityManager->remove($pay);
                    $this->logger->info('Registro Pay eliminado', [
                        'pay_id' => $pay->getId(),
                        'reservation_id' => $reservation->getId(),
                        'user_id' => $id
                    ]);
                }

                // Desvincular el pasajero, si existe
                if ($reservation->getPassengers()) {
                    $reservation->setPassengers(null);
                    $this->logger->info('Pasajero desvinculado de la reserva', [
                        'reservation_id' => $reservation->getId(),
                        'user_id' => $id
                    ]);
                }

                // Eliminar la reserva
                $entityManager->remove($reservation);
                $this->logger->info('Reserva eliminada', [
                    'reservation_id' => $reservation->getId(),
                    'user_id' => $id
                ]);
            }

            // Eliminar el usuario
            $entityManager->remove($user);
            $this->logger->info('Eliminando usuario', ['user_id' => $id]);

            // Confirmar todos los cambios en la base de datos
            $entityManager->flush();

            $this->logger->info('Usuario y registros relacionados eliminados exitosamente', ['user_id' => $id]);
            return $this->json(['message' => 'Usuario y registros relacionados eliminados exitosamente'], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            $this->logger->error('Error al eliminar usuario: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $id
            ]);
            return $this->json(['error' => 'Error al eliminar el usuario: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}