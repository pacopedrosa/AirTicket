<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ReservationsRepository;
use TCPDF;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/user')]
class UserFlightController extends AbstractController
{
    private $reservationRepository;

    public function __construct(ReservationsRepository $reservationRepository)
    {
        $this->reservationRepository = $reservationRepository;
    }

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

    #[Route('/flights/{id}/pdf', name: 'app_user_flight_pdf', methods: ['GET'])]
    public function generateFlightPDF(int $id): Response
    {
        try {
            $user = $this->getUser();
            if (!$user) {
                return $this->json(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
            }

            // Obtener la reserva del vuelo
            $reservation = $this->reservationRepository->findOneBy([
                'id' => $id,
                'user' => $user
            ]);

            if (!$reservation) {
                return $this->json(['error' => 'Reserva no encontrada'], Response::HTTP_NOT_FOUND);
            }

            // Asegurarnos de que el usuario está cargado completamente
            $user = $reservation->getUser();
            if (!$user) {
                return $this->json(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
            }

            // Crear el PDF
            $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

            // Configurar el documento
            $pdf->SetCreator('AirTicket');
            $pdf->SetAuthor('AirTicket');
            $pdf->SetTitle('Reserva de Vuelo #' . $reservation->getId());

            // Eliminar encabezado y pie de página por defecto
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);

            // Añadir una página
            $pdf->AddPage();

            // Obtener el nombre completo del usuario de forma segura
            $userFullName = $user->getFullName() ?? $user->getEmail();

            // Contenido del PDF
            $html = '
                <h1 style="text-align:center;color:#B45309;">AirTicket</h1>
                <h2 style="text-align:center;color:#92400E;">Comprobante de Reserva</h2>
                <br><br>
                <table border="1" cellpadding="5">
                    <tr>
                        <th style="background-color:#FEF3C7;">Número de Reserva</th>
                        <td>' . $reservation->getId() . '</td>
                    </tr>
                    <tr>
                        <th style="background-color:#FEF3C7;">Pasajero</th>
                        <td>' . htmlspecialchars($userFullName) . '</td>
                    </tr>
                    <tr>
                        <th style="background-color:#FEF3C7;">Número de Vuelo</th>
                        <td>' . htmlspecialchars($reservation->getFlight()->getFlightNumber()) . '</td>
                    </tr>
                    <tr>
                        <th style="background-color:#FEF3C7;">Origen</th>
                        <td>' . htmlspecialchars($reservation->getFlight()->getOrigin()) . '</td>
                    </tr>
                    <tr>
                        <th style="background-color:#FEF3C7;">Destino</th>
                        <td>' . htmlspecialchars($reservation->getFlight()->getDestination()) . '</td>
                    </tr>
                    <tr>
                        <th style="background-color:#FEF3C7;">Fecha de Salida</th>
                        <td>' . $reservation->getFlight()->getDepartureDate()->format('d/m/Y H:i') . '</td>
                    </tr>
                    <tr>
                        <th style="background-color:#FEF3C7;">Fecha de Llegada</th>
                        <td>' . $reservation->getFlight()->getArrivalDate()->format('d/m/Y H:i') . '</td>
                    </tr>
                    <tr>
                        <th style="background-color:#FEF3C7;">Precio Total</th>
                        <td>€' . number_format($reservation->getTotalPrice(), 2) . '</td>
                    </tr>
                    <tr>
                        <th style="background-color:#FEF3C7;">Estado</th>
                        <td>' . htmlspecialchars($reservation->getState()) . '</td>
                    </tr>
                </table>
                <br><br>
                <p style="text-align:center;color:#92400E;">¡Gracias por volar con AirTicket!</p>
            ';

            $pdf->writeHTML($html, true, false, true, false, '');

            // Generar el PDF
            $pdfContent = $pdf->Output('reserva_vuelo_' . $reservation->getId() . '.pdf', 'S');

            // Devolver el PDF como respuesta
            return new Response(
                $pdfContent,
                Response::HTTP_OK,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="reserva_vuelo_' . $reservation->getId() . '.pdf"'
                ]
            );
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error al generar el PDF: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}