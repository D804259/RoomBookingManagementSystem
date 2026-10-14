<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\RoomStatus;
use Database\Factories\RoomFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['room_number', 'room_type', 'description', 'price_per_night', 'capacity', 'image', 'status'])]
class Room extends Model
{
    /** @use HasFactory<RoomFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_per_night' => 'decimal:2',
            'capacity' => 'integer',
            'status' => RoomStatus::class,
        ];
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function isAvailableForBooking(): bool
    {
        return $this->status === RoomStatus::Available;
    }

    public function hasActiveBookings(): bool
    {
        return $this->bookings()
            ->whereIn('status', array_map(
                fn (BookingStatus $status) => $status->value,
                BookingStatus::occupying()
            ))
            ->exists();
    }

    public function imageUrl(): string
    {
        if (! $this->image) {
            return asset('images/rooms/placeholder.svg');
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        if (str_starts_with($this->image, 'images/')) {
            return asset($this->image);
        }

        return asset('storage/'.$this->image);
    }

    /**
     * @param  Builder<Room>  $query
     * @return Builder<Room>
     */
    public function scopeSearch(Builder $query, ?string $type, ?string $maxPrice, ?string $guests): Builder
    {
        return $query
            ->when($type, fn (Builder $builder) => $builder->where('room_type', $type))
            ->when($maxPrice !== null && $maxPrice !== '', fn (Builder $builder) => $builder->where('price_per_night', '<=', $maxPrice))
            ->when($guests !== null && $guests !== '', fn (Builder $builder) => $builder->where('capacity', '>=', $guests));
    }
}
