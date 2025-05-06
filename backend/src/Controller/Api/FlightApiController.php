<?php

namespace App\Controller\Api;

use App\Entity\Flight;
use App\Entity\Reservations;  // Add this import
use App\Entity\Pay;
use App\Repository\FlightRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/flights')]
#[IsGranted('ROLE_USER')]
class FlightApiController extends AbstractController
{
    public function __construct(
        private FlightRepository $flightRepository,
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('', name: 'api_flights_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        try {
            $origin = $request->query->get('origin');
            $destination = $request->query->get('destination');
            $date = $request->query->get('date');

            // Get flights based on provided filters
            $flights = $this->flightRepository->findByFilters($origin, $destination, $date);

            // Transform flights to array
            $flightsArray = array_map(function($flight) {
                return [
                    'id' => $flight->getId(),
                    'flight_number' => $flight->getFlightNumber(),
                    'origin' => $flight->getOrigin(),
                    'destination' => $flight->getDestination(),
                    'departure_date' => $flight->getDepartureDate()->format('Y-m-d H:i:s'),
                    'arrival_date' => $flight->getArrivalDate()->format('Y-m-d H:i:s'),
                    'base_price' => $flight->getBasePrice(),
                    'total_seats' => $flight->getTotalSeats(),
                    'seats_available' => $flight->getSeatsAvailable()
                ];
            }, $flights);

            return new JsonResponse($flightsArray, Response::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error processing request: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    #[Route('/{id}', name: 'api_flight_show', methods: ['GET'])]
    public function show(Flight $flight): JsonResponse
    {
        try {
            $flightData = [
                'id' => $flight->getId(),
                'flight_number' => $flight->getFlightNumber(),
                'origin' => $flight->getOrigin(),
                'destination' => $flight->getDestination(),
                'departure_date' => $flight->getDepartureDate()->format('Y-m-d H:i:s'),
                'arrival_date' => $flight->getArrivalDate()->format('Y-m-d H:i:s'),
                'base_price' => $flight->getBasePrice(),
                'total_seats' => $flight->getTotalSeats(),
                'seats_available' => $flight->getSeatsAvailable()
            ];

            return new JsonResponse($flightData, Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error retrieving flight details'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('', name: 'api_flights_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $flight = $this->serializer->deserialize(
            $request->getContent(),
            Flight::class,
            'json'
        );

        $errors = $this->validator->validate($flight);
        if (count($errors) > 0) {
            return new JsonResponse(
                $this->serializer->serialize($errors, 'json'),
                Response::HTTP_BAD_REQUEST,
                [],
                true
            );
        }

        $this->entityManager->persist($flight);
        $this->entityManager->flush();

        $data = $this->serializer->serialize($flight, 'json');
        return new JsonResponse($data, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}', name: 'api_flights_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, Flight $flight): JsonResponse
    {
        $this->serializer->deserialize(
            $request->getContent(),
            Flight::class,
            'json',
            ['object_to_populate' => $flight]
        );

        $errors = $this->validator->validate($flight);
        if (count($errors) > 0) {
            return new JsonResponse(
                $this->serializer->serialize($errors, 'json'),
                Response::HTTP_BAD_REQUEST,
                [],
                true
            );
        }

        $this->entityManager->flush();

        $data = $this->serializer->serialize($flight, 'json');
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'api_flights_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(Flight $flight): JsonResponse
    {
        $this->entityManager->remove($flight);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/search', name: 'api_flights_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        try {
            $origin = $request->query->get('origin');
            $destination = $request->query->get('destination');
            $date = $request->query->get('date');

            // Add validation
            if (!$origin || !$destination || !$date) {
                return new JsonResponse(
                    ['error' => 'Missing required parameters'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Create a repository method to handle the search
            $flights = $this->flightRepository->findBySearchCriteria($origin, $destination, $date);
            
            // Convert DateTime objects to string and include all necessary fields
            $flightsArray = array_map(function($flight) {
                return [
                    'id' => $flight->getId(),
                    'flight_number' => $flight->getFlightNumber(),
                    'origin' => $flight->getOrigin(),
                    'destination' => $flight->getDestination(),
                    'departure_date' => $flight->getDepartureDate()->format('Y-m-d H:i:s'),
                    'arrival_date' => $flight->getArrivalDate()->format('Y-m-d H:i:s'),
                    'base_price' => $flight->getBasePrice(),
                    'total_seats' => $flight->getTotalSeats(),
                    'seats_available' => $flight->getSeatsAvailable()
                ];
            }, $flights);

            return new JsonResponse($flightsArray, Response::HTTP_OK);
            
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error processing request: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/{id}/book', name: 'api_flight_book', methods: ['POST'])]
    public function bookFlight(
        Flight $flight, 
        Request $request, 
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $paymentMethod = $data['payment_method'] ?? null;
    
            if (!$paymentMethod) {
                return new JsonResponse(
                    ['error' => 'Payment method is required'],
                    Response::HTTP_BAD_REQUEST
                );
            }
    
            // Check if seats are available
            if ($flight->getSeatsAvailable() <= 0) {
                return new JsonResponse(
                    ['error' => 'No seats available for this flight'],
                    Response::HTTP_BAD_REQUEST
                );
            }
    
            // Create new reservation
            $reservation = new Reservations();
            $reservation->setFlight($flight);
            $reservation->setUser($this->getUser());
            $reservation->setState('confirmed'); // Initial state
            $reservation->setPaymentMethod($paymentMethod);
            $reservation->setTotalPrice($flight->getBasePrice());
            $reservation->setReservationDate(new \DateTime());
    
            // Create payment record
            $payment = new Pay();
            $payment->setReservation($reservation);
            $payment->setAmount($flight->getBasePrice());
            $payment->setPaymentMethod($paymentMethod);
            $payment->setPaymentDate(new \DateTime());
            $payment->setState('confirmed');
    
            // Update flight seats
            $flight->setSeatsAvailable($flight->getSeatsAvailable() - 1);
            
            $entityManager->persist($reservation);
            $entityManager->persist($payment);
            $entityManager->flush();
    
            return new JsonResponse([
                'message' => 'Flight booked successfully',
                'reservation_id' => $reservation->getId(),
                'payment_id' => $payment->getId()
            ], Response::HTTP_CREATED);
    
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error booking flight: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/{id}/confirm-payment', name: 'api_flight_confirm_payment', methods: ['POST'])]
    public function confirmPayment(
        Reservations $reservation,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            // Get associated payment
            $payment = $entityManager->getRepository(Pay::class)->findOneBy(['reservation' => $reservation]);
            
            if (!$payment) {
                return new JsonResponse(
                    ['error' => 'Payment not found'],
                    Response::HTTP_NOT_FOUND
                );
            }
    
            // Update payment and reservation status
            $payment->setState('completed');
            $reservation->setState('confirmed');
    
            $entityManager->flush();
    
            return new JsonResponse([
                'message' => 'Payment confirmed successfully',
                'reservation_status' => 'confirmed'
            ]);
    
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error confirming payment: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/update-dates', name: 'api_flights_update_dates', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateFlightDates(): JsonResponse
    {
        try {
            // Obtener la fecha actual
            $today = new \DateTime('today');

            // Buscar vuelos con departure_date anterior a hoy y sin reservas
            $flights = $this->flightRepository->findFlightsBeforeDate($today);

            if (empty($flights)) {
                return new JsonResponse(
                    ['message' => 'No se encontraron vuelos sin reservas con fechas anteriores a hoy.'],
                    Response::HTTP_OK
                );
            }

            $updatedCount = 0;
            foreach ($flights as $flight) {
                // Calcular la diferencia entre departure_date y arrival_date
                $interval = $flight->getDepartureDate()->diff($flight->getArrivalDate());

                // Sumar un mes a departure_date
                $newDepartureDate = clone $flight->getDepartureDate();
                $newDepartureDate->modify('+1 month');

                // Calcular nueva arrival_date manteniendo la diferencia
                $newArrivalDate = clone $newDepartureDate;
                $newArrivalDate->add($interval);

                // Actualizar las fechas
                $flight->setDepartureDate($newDepartureDate);
                $flight->setArrivalDate($newArrivalDate);

                $this->entityManager->persist($flight);
                $updatedCount++;
            }

            // Guardar los cambios en la base de datos
            $this->entityManager->flush();

            return new JsonResponse(
                ['message' => sprintf('Se actualizaron %d vuelos.', $updatedCount)],
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error al actualizar las fechas de los vuelos: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
