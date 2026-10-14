<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Database\Factories\BookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

#[Fillable(['user_id', 'room_id', 'check_in', 'check_out', 'guests', 'total_price', 'status'])]
class Booking extends Model
{
    /** @use HasFactory<BookingFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'check_in' => 'date',
            'check_out' => 'date',
            'guests' => 'integer',
            'total_price' => 'decimal:2',
            'status' => BookingStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function nights(): int
    {
        return (int) $this->check_in->diffInDays($this->check_out);
    }

    public function isCancellableByCustomer(): bool
    {
        if (! in_array($this->status, [BookingStatus::Pending, BookingStatus::Confirmed], true)) {
            return false;
        }

        return $this->check_in->greaterThan(Carbon::today());
    }

    public function isCancellableByAdmin(): bool
    {
        return in_array($this->status, [BookingStatus::Pending, BookingStatus::Confirmed], true);
    }

    public function isApprovable(): bool
    {
        return $this->status === BookingStatus::Pending;
    }

    public function isRejectable(): bool
    {
        return $this->status === BookingStatus::Pending;
    }

    /**
     * @param  Builder<Booking>  $query
     * @return Builder<Booking>
     */
    public function scopeOccupying(Builder $query): Builder
    {
        return $query->whereIn('status', array_map(
            fn (BookingStatus $status) => $status->value,
            BookingStatus::occupying()
        ));
    }

    /**
     * @param  Builder<Booking>  $query
     * @return Builder<Booking>
     */
    public function scopeOverlapping(Builder $query, string $checkIn, string $checkOut): Builder
    {
        return $query
            ->where('check_in', '<', $checkOut)
            ->where('check_out', '>', $checkIn);
    }
}
