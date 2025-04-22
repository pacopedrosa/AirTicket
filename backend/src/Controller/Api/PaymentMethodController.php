<?php

namespace App\Controller\Api;

use App\Repository\PayRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
#[IsGranted('ROLE_USER')]
class PaymentMethodController extends AbstractController
{
    public function __construct(
        private PayRepository $payRepository
    ) {
    }

    #[Route('/payment-methods', name: 'api_payment_methods', methods: ['GET'])]
    public function getPaymentMethods(): JsonResponse
    {
        // For now, return static payment methods
        // Later you can make this dynamic from database
        $paymentMethods = [
            [
                'id' => 'credit_card',
                'name' => 'Tarjeta de Crédito',
            ],
            [
                'id' => 'debit_card',
                'name' => 'Tarjeta de Débito',
            ],
            [
                'id' => 'paypal',
                'name' => 'PayPal',
            ],
            [
                'id' => 'bank_transfer',
                'name' => 'Transferencia Bancaria',
            ]
        ];

        return new JsonResponse($paymentMethods);
    }
}