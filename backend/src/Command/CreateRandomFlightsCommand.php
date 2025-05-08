<?php

namespace App\Command;

use App\Entity\Flight;
use App\Repository\FlightRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputOption;

#[AsCommand(
    name: 'app:create-random-flights',
    description: 'Crea vuelos aleatorios con fechas y horas posteriores a hoy'
)]
class CreateRandomFlightsCommand extends Command
{
    private $flightRepository;
    private $entityManager;

    public function __construct(
        FlightRepository $flightRepository,
        EntityManagerInterface $entityManager
    ) {
        parent::__construct();
        $this->flightRepository = $flightRepository;
        $this->entityManager = $entityManager;
    }

    protected function configure(): void
    {
        $this
            ->addOption(
                'count',
                'c',
                InputOption::VALUE_OPTIONAL,
                '¿Cuántos vuelos aleatorios quieres crear?',
                5
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $count = $input->getOption('count');
            
            // Obtener ciudades únicas de la base de datos
            $queryOrigins = $this->entityManager->createQuery(
                'SELECT DISTINCT f.origin FROM App\Entity\Flight f'
            )->getResult();
            
            $queryDestinations = $this->entityManager->createQuery(
                'SELECT DISTINCT f.destination FROM App\Entity\Flight f'
            )->getResult();
            
            // Combinar y eliminar duplicados
            $cities = array_unique(array_merge(
                array_column($queryOrigins, 'origin'),
                array_column($queryDestinations, 'destination')
            ));
            
            // Si no hay ciudades en la base de datos, usar algunas por defecto
            if (empty($cities)) {
                $cities = [
                    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao',
                    'Málaga', 'Alicante', 'Palma de Mallorca'
                ];
            }

            $createdFlights = 0;
            for ($i = 0; $i < $count; $i++) {
                // Seleccionar origen y destino diferentes
                $origin = $cities[array_rand($cities)];
                do {
                    $destination = $cities[array_rand($cities)];
                } while ($destination === $origin);

                // Generar fecha y hora de salida aleatoria (entre mañana y 3 meses)
                $tomorrow = new \DateTime('tomorrow');
                $threeMonthsLater = new \DateTime('+3 months');
                $departureDate = new \DateTime();
                $departureDate->setTimestamp(rand($tomorrow->getTimestamp(), $threeMonthsLater->getTimestamp()));
                
                // Generar duración aleatoria del vuelo (entre 1 y 4 horas)
                $flightDuration = rand(1, 4);
                $arrivalDate = clone $departureDate;
                $arrivalDate->modify("+{$flightDuration} hours");

                $flight = new Flight();
                $flight->setFlightNumber('FL' . rand(1000, 9999));
                $flight->setOrigin($origin);
                $flight->setDestination($destination);
                $flight->setDepartureDate($departureDate);
                $flight->setArrivalDate($arrivalDate);
                $flight->setBasePrice(rand(50, 300));
                $flight->setTotalSeats(rand(100, 200));
                $flight->setSeatsAvailable($flight->getTotalSeats());

                $this->entityManager->persist($flight);
                $createdFlights++;
            }

            $this->entityManager->flush();
            $output->writeln(sprintf('Se han creado %d vuelos aleatorios exitosamente.', $createdFlights));

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $output->writeln('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}