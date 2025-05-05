<?php

namespace App\Controller\Admin;

use App\Repository\BookingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/admin')]
class BookingController extends AbstractController
{
    #[Route('/bookings', name: 'admin_bookings_list', methods: ['GET'])]
    public function listBookings(Request $request, BookingRepository $bookingRepository): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $bookings = $bookingRepository->findBy(
            [], // criteria
            ['bookingDate' => 'DESC'], // orderBy
            $limit, // limit
            ($page - 1) * $limit // offset
        );

        $data = array_map(function($booking) {
            return [
                'id' => $booking->getId(),
                'flight' => [
                    'flightNumber' => $booking->getFlight()->getFlightNumber(),
                    'origin' => $booking->getFlight()->getOrigin(),
                    'destination' => $booking->getFlight()->getDestination(),
                ],
                'passenger' => [
                    'firstName' => $booking->getPassenger()->getFirstName(),
                    'lastName' => $booking->getPassenger()->getLastName(),
                ],
                'status' => $booking->getStatus(),
                'totalAmount' => $booking->getTotalAmount(),
                'bookingDate' => $booking->getBookingDate()->format('Y-m-d H:i:s'),
            ];
        }, $bookings);

        return $this->json($data);
    }
}