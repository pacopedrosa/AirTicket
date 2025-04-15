<?php

namespace App\Controller\Api;

use App\Entity\Flight;
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
    public function list(): JsonResponse
    {
        $flights = $this->flightRepository->findAll();
        $data = $this->serializer->serialize($flights, 'json');
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'api_flights_show', methods: ['GET'])]
    public function show(Flight $flight): JsonResponse
    {
        $data = $this->serializer->serialize($flight, 'json');
        return new JsonResponse($data, Response::HTTP_OK, [], true);
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
        $origin = $request->query->get('origin');
        $destination = $request->query->get('destination');
        $date = $request->query->get('date');

        $flights = $this->flightRepository->findByFilters($origin, $destination, $date);
        $data = $this->serializer->serialize($flights, 'json');
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }
}
