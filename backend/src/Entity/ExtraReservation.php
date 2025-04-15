<?php

namespace App\Entity;

use App\Repository\ExtraReservationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ExtraReservationRepository::class)]
class ExtraReservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $amount = null;

    /**
     * @var Collection<int, Extra>
     */
    #[ORM\ManyToMany(targetEntity: Extra::class, inversedBy: 'extraReservations')]
    private Collection $extra;

    public function __construct()
    {
        $this->extra = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?int
    {
        return $this->amount;
    }

    public function setAmount(int $amount): static
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * @return Collection<int, Extra>
     */
    public function getExtra(): Collection
    {
        return $this->extra;
    }

    public function addExtra(Extra $extra): static
    {
        if (!$this->extra->contains($extra)) {
            $this->extra->add($extra);
        }

        return $this;
    }

    public function removeExtra(Extra $extra): static
    {
        $this->extra->removeElement($extra);

        return $this;
    }
}
