<?php

namespace App\Controller\Api;

use App\Entity\Extra;
use App\Entity\ExtraReservation;
use App\Repository\ExtraRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/extras')]
class ExtraController extends AbstractController
{
    private $extraRepository;
    private $entityManager;

    public function __construct(
        ExtraRepository $extraRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->extraRepository = $extraRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('', methods: ['GET'])]
    public function getExtras(): JsonResponse
    {
        $extras = $this->extraRepository->findAll();
        $extrasArray = array_map(function($extra) {
            return [
                'id' => $extra->getId(),
                'description' => $extra->getDescription(),
                'price' => $extra->getPrice()
            ];
        }, $extras);

        return new JsonResponse($extrasArray);
    }

    #[Route('/reserve', methods: ['POST'])]
    public function reserveExtras(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['extras']) || !is_array($data['extras'])) {
            return new JsonResponse(['error' => 'Datos de extras inválidos'], 400);
        }

        $extraReservation = new ExtraReservation();
        $extraReservation->setAmount(0); // Se actualizará con el total

        $totalAmount = 0;
        foreach ($data['extras'] as $extraData) {
            $extra = $this->extraRepository->find($extraData['id']);
            if (!$extra) {
                continue;
            }
            
            $extraReservation->addExtra($extra);
            $totalAmount += $extra->getPrice() * ($extraData['quantity'] ?? 1);
        }

        $extraReservation->setAmount($totalAmount);
        
        $this->entityManager->persist($extraReservation);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $extraReservation->getId(),
            'amount' => $extraReservation->getAmount()
        ]);
    }
}