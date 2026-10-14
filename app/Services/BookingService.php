<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\RoomStatus;
use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    /**
     * Create a pending booking after validating dates, capacity, and availability.
     *
     * Reservation policy: both pending and confirmed bookings occupy the room
     * so overlapping requests cannot double-book the same nights.
     */
    public function create(User $user, Room $room, string $checkIn, string $checkOut, int $guests): Booking
    {
        $this->assertStayDates($checkIn, $checkOut);

        return DB::transaction(function () use ($user, $room, $checkIn, $checkOut, $guests) {
            $lockedRoom = Room::query()->whereKey($room->id)->lockForUpdate()->firstOrFail();

            $this->assertRoomCanBeBooked($lockedRoom, $guests);
            $this->assertNoOverlap($lockedRoom->id, $checkIn, $checkOut);

            $nights = $this->nights($checkIn, $checkOut);
            $totalPrice = $this->calculateTotal($lockedRoom, $nights);

            return Booking::query()->create([
                'user_id' => $user->id,
                'room_id' => $lockedRoom->id,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'guests' => $guests,
                'total_price' => $totalPrice,
                'status' => BookingStatus::Pending,
            ]);
        });
    }

    public function isAvailable(Room $room, string $checkIn, string $checkOut, int $guests): bool
    {
        try {
            $this->assertStayDates($checkIn, $checkOut);
            $this->assertRoomCanBeBooked($room, $guests);
            $this->assertNoOverlap($room->id, $checkIn, $checkOut);
        } catch (ValidationException) {
            return false;
        }

        return true;
    }

    public function calculateTotal(Room $room, int $nights): string
    {
        return bcmul((string) $room->price_per_night, (string) $nights, 2);
    }

    public function nights(string $checkIn, string $checkOut): int
    {
        return (int) Carbon::parse($checkIn)->startOfDay()->diffInDays(Carbon::parse($checkOut)->startOfDay());
    }

    public function approve(Booking $booking): Booking
    {
        return DB::transaction(function () use ($booking) {
            $locked = Booking::query()->whereKey($booking->id)->lockForUpdate()->firstOrFail();

            if (! $locked->isApprovable()) {
                throw ValidationException::withMessages([
                    'status' => 'Only pending bookings can be approved.',
                ]);
            }

            $locked->status = BookingStatus::Confirmed;
            $locked->save();

            return $locked;
        });
    }

    public function reject(Booking $booking): Booking
    {
        return DB::transaction(function () use ($booking) {
            $locked = Booking::query()->whereKey($booking->id)->lockForUpdate()->firstOrFail();

            if (! $locked->isRejectable()) {
                throw ValidationException::withMessages([
                    'status' => 'Only pending bookings can be rejected.',
                ]);
            }

            $locked->status = BookingStatus::Rejected;
            $locked->save();

            return $locked;
        });
    }

    public function cancel(Booking $booking, bool $byAdmin = false): Booking
    {
        return DB::transaction(function () use ($booking, $byAdmin) {
            $locked = Booking::query()->whereKey($booking->id)->lockForUpdate()->firstOrFail();

            $allowed = $byAdmin ? $locked->isCancellableByAdmin() : $locked->isCancellableByCustomer();

            if (! $allowed) {
                throw ValidationException::withMessages([
                    'status' => $byAdmin
                        ? 'This booking cannot be cancelled.'
                        : 'This booking can no longer be cancelled. Check-in must still be in the future.',
                ]);
            }

            $locked->status = BookingStatus::Cancelled;
            $locked->save();

            return $locked;
        });
    }

    public function markCompletedStays(): int
    {
        return Booking::query()
            ->where('status', BookingStatus::Confirmed)
            ->whereDate('check_out', '<=', Carbon::today())
            ->update(['status' => BookingStatus::Completed->value]);
    }

    public function assertStayDates(string $checkIn, string $checkOut): void
    {
        $start = Carbon::parse($checkIn)->startOfDay();
        $end = Carbon::parse($checkOut)->startOfDay();

        if (! $start->greaterThan(Carbon::today())) {
            throw ValidationException::withMessages([
                'check_in' => 'The check-in date must be in the future.',
            ]);
        }

        if (! $end->greaterThan($start)) {
            throw ValidationException::withMessages([
                'check_out' => 'The check-out date must be after the check-in date.',
            ]);
        }
    }

    private function assertRoomCanBeBooked(Room $room, int $guests): void
    {
        if ($room->status !== RoomStatus::Available) {
            throw ValidationException::withMessages([
                'room' => 'This room is under maintenance and cannot be booked.',
            ]);
        }

        if ($guests > $room->capacity) {
            throw ValidationException::withMessages([
                'guests' => 'The number of guests cannot exceed the room capacity of '.$room->capacity.'.',
            ]);
        }
    }

    private function assertNoOverlap(int $roomId, string $checkIn, string $checkOut, ?int $ignoreBookingId = null): void
    {
        $overlap = Booking::query()
            ->where('room_id', $roomId)
            ->occupying()
            ->overlapping($checkIn, $checkOut)
            ->when($ignoreBookingId, fn ($query) => $query->whereKeyNot($ignoreBookingId))
            ->lockForUpdate()
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages([
                'check_in' => 'This room is not available for the selected dates. Pending and confirmed stays both hold the room.',
            ]);
        }
    }
}
