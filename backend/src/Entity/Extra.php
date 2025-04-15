<?php

namespace App\Entity;

use App\Repository\ExtraRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ExtraRepository::class)]
class Extra
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $price = null;

    /**
     * @var Collection<int, ExtraReservation>
     */
    #[ORM\ManyToMany(targetEntity: ExtraReservation::class, mappedBy: 'extra')]
    private Collection $extraReservations;

    public function __construct()
    {
        $this->extraReservations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @return Collection<int, ExtraReservation>
     */
    public function getExtraReservations(): Collection
    {
        return $this->extraReservations;
    }

    public function addExtraReservation(ExtraReservation $extraReservation): static
    {
        if (!$this->extraReservations->contains($extraReservation)) {
            $this->extraReservations->add($extraReservation);
            $extraReservation->addExtra($this);
        }

        return $this;
    }

    public function removeExtraReservation(ExtraReservation $extraReservation): static
    {
        if ($this->extraReservations->removeElement($extraReservation)) {
            $extraReservation->removeExtra($this);
        }

        return $this;
    }
}
