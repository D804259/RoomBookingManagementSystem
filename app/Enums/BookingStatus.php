<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Rejected = 'rejected';
    case Cancelled = 'cancelled';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Confirmed => 'Confirmed',
            self::Rejected => 'Rejected',
            self::Cancelled => 'Cancelled',
            self::Completed => 'Completed',
        };
    }

    public function badgeClass(): string
    {
        return match ($this) {
            self::Pending => 'badge-pending',
            self::Confirmed => 'badge-confirmed',
            self::Rejected => 'badge-rejected',
            self::Cancelled => 'badge-cancelled',
            self::Completed => 'badge-completed',
        };
    }

    /**
     * Statuses that occupy a room and must block overlapping dates.
     *
     * @return list<self>
     */
    public static function occupying(): array
    {
        return [self::Pending, self::Confirmed];
    }
}
