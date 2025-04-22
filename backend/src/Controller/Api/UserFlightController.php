<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ReservationsRepository;

#[Route('/api/user')]
class UserFlightController extends AbstractController
{
    #[Route('/flights', name: 'api_user_flights', methods: ['GET'])]
    public function getUserFlights(ReservationsRepository $reservationsRepository): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $reservations = $reservationsRepository->findBy(['user' => $user]);
        
        $flights = array_map(function($reservation) {
            $flight = $reservation->getFlight();
            return [
                'id' => $flight->getId(),
                'flight_number' => $flight->getFlightNumber(),
                'origin' => $flight->getOrigin(),
                'destination' => $flight->getDestination(),
                'departure_date' => $flight->getDepartureDate()->format('Y-m-d H:i:s'),
                'arrival_date' => $flight->getArrivalDate()->format('Y-m-d H:i:s'),
                'reservation_id' => $reservation->getId(),
                'reservation_status' => $reservation->getState(),
                'payment_method' => $reservation->getPaymentMethod(),
                'total_price' => $reservation->getTotalPrice(),
                'reservation_date' => $reservation->getReservationDate()->format('Y-m-d H:i:s')
            ];
        }, $reservations);

        return new JsonResponse($flights);
    }
}