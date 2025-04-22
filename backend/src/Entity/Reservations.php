<?php

namespace App\Entity;

use App\Repository\ReservationsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReservationsRepository::class)]
class Reservations
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $reservation_date = null;

    #[ORM\Column(length: 255)]
    private ?string $state = null;

    #[ORM\Column]
    private ?int $total_price = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id")]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(name: "flight_id", referencedColumnName: "id")]
    private ?Flight $flight = null;

    #[ORM\ManyToOne(inversedBy: 'reservation')]
    #[ORM\JoinColumn(name: "passengers_id", referencedColumnName: "id")]
    private ?Passengers $passengers = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $payment_method = null;

    public function __construct()
    {
        $this->reservation_date = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReservationDate(): ?\DateTimeInterface
    {
        return $this->reservation_date;
    }

    public function setReservationDate(\DateTimeInterface $reservation_date): static
    {
        $this->reservation_date = $reservation_date;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function getTotalPrice(): ?int
    {
        return $this->total_price;
    }

    public function setTotalPrice(int $total_price): static
    {
        $this->total_price = $total_price;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getFlight(): ?Flight
    {
        return $this->flight;
    }

    public function setFlight(?Flight $flight): static
    {
        $this->flight = $flight;

        return $this;
    }

    public function getPassengers(): ?Passengers
    {
        return $this->passengers;
    }

    public function setPassengers(?Passengers $passengers): static
    {
        $this->passengers = $passengers;

        return $this;
    }

    public function getPaymentMethod(): ?string
    {
        return $this->payment_method;
    }

    public function setPaymentMethod(?string $payment_method): static
    {
        $this->payment_method = $payment_method;
        return $this;
    }
}
