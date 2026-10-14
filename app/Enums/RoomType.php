<?php

namespace App\Enums;

enum RoomType: string
{
    case Standard = 'Standard';
    case Deluxe = 'Deluxe';
    case Suite = 'Suite';
    case Family = 'Family';
    case Executive = 'Executive';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
