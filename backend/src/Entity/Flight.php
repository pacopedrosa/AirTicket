<?php

namespace App\Entity;

use App\Repository\FlightRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FlightRepository::class)]
class Flight
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $flight_number = null;

    #[ORM\Column(length: 255)]
    private ?string $origin = null;

    #[ORM\Column(length: 255)]
    private ?string $destination = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $departure_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $arrival_date = null;

    #[ORM\Column]
    private ?int $base_price = null;

    #[ORM\Column]
    private ?int $total_seats = null;

    #[ORM\Column]
    private ?int $seats_available = null;

    /**
     * @var Collection<int, Reservations>
     */
    #[ORM\OneToMany(targetEntity: Reservations::class, mappedBy: 'flight')]
    private Collection $reservations;

    public function __construct()
    {
        $this->reservations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFlightNumber(): ?string
    {
        return $this->flight_number;
    }

    public function setFlightNumber(string $flight_number): static
    {
        $this->flight_number = $flight_number;

        return $this;
    }

    public function getOrigin(): ?string
    {
        return $this->origin;
    }

    public function setOrigin(string $origin): static
    {
        $this->origin = $origin;

        return $this;
    }

    public function getDestination(): ?string
    {
        return $this->destination;
    }

    public function setDestination(string $destination): static
    {
        $this->destination = $destination;

        return $this;
    }

    public function getDepartureDate(): ?\DateTimeInterface
    {
        return $this->departure_date;
    }

    public function setDepartureDate(\DateTimeInterface $departure_date): static
    {
        $this->departure_date = $departure_date;

        return $this;
    }

    public function getArrivalDate(): ?\DateTimeInterface
    {
        return $this->arrival_date;
    }

    public function setArrivalDate(\DateTimeInterface $arrival_date): static
    {
        $this->arrival_date = $arrival_date;

        return $this;
    }

    public function getBasePrice(): ?int
    {
        return $this->base_price;
    }

    public function setBasePrice(int $base_price): static
    {
        $this->base_price = $base_price;

        return $this;
    }

    public function getTotalSeats(): ?int
    {
        return $this->total_seats;
    }

    public function setTotalSeats(int $total_seats): static
    {
        $this->total_seats = $total_seats;

        return $this;
    }

    public function getSeatsAvailable(): ?int
    {
        return $this->seats_available;
    }

    public function setSeatsAvailable(int $seats_available): static
    {
        $this->seats_available = $seats_available;

        return $this;
    }

    /**
     * @return Collection<int, Reservations>
     */
    public function getReservations(): Collection
    {
        return $this->reservations;
    }

    public function addReservation(Reservations $reservation): static
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations->add($reservation);
            $reservation->setFlight($this);
        }

        return $this;
    }

    public function removeReservation(Reservations $reservation): static
    {
        if ($this->reservations->removeElement($reservation)) {
            // set the owning side to null (unless already changed)
            if ($reservation->getFlight() === $this) {
                $reservation->setFlight(null);
            }
        }

        return $this;
    }
}
