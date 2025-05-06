<?php

namespace App\Command;

use App\Repository\FlightRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:update-flight-dates',
    description: 'Actualiza las fechas de vuelos anteriores a hoy sumando un mes, solo para vuelos sin reservas.'
)]
class UpdateFlightDatesCommand extends Command
{
    public function __construct(
        private FlightRepository $flightRepository,
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $today = new \DateTime('today');
            $flights = $this->flightRepository->findFlightsBeforeDate($today);

            if (empty($flights)) {
                $output->writeln('No se encontraron vuelos sin reservas para actualizar.');
                return Command::SUCCESS;
            }

            $updatedCount = 0;
            foreach ($flights as $flight) {
                $interval = $flight->getDepartureDate()->diff($flight->getArrivalDate());
                $newDepartureDate = clone $flight->getDepartureDate();
                $newDepartureDate->modify('+1 month');
                $newArrivalDate = clone $newDepartureDate;
                $newArrivalDate->add($interval);

                $flight->setDepartureDate($newDepartureDate);
                $flight->setArrivalDate($newArrivalDate);

                $this->entityManager->persist($flight);
                $updatedCount++;
            }

            $this->entityManager->flush();
            $output->writeln(sprintf('Se actualizaron %d vuelos.', $updatedCount));

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $output->writeln('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}