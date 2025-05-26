<?php

namespace App\Controller\Api;

use App\Repository\FlightRepository;
use App\Repository\ReservationsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class StatisticsController extends AbstractController
{
    #[Route('/statistics', name: 'app_statistics', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getStatistics(
        FlightRepository $flightRepository,
        ReservationsRepository $reservationsRepository
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        try {
            return $this->json([
                'topTraveler' => $reservationsRepository->findTopTraveler($user),
                'popularDestination' => $reservationsRepository->findMostPopularDestination($user),
                'totalFlights' => $reservationsRepository->count(['user' => $user]),
                'averageDuration' => $flightRepository->calculateAverageDuration($user),
                'carbonOffset' => $reservationsRepository->calculateTotalCarbonOffset($user),
                'username' => $user->getUsername(),
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error fetching statistics'], 500);
        }
    }
}