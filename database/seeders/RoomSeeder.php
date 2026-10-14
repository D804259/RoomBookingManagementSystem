<?php

namespace Database\Seeders;

use App\Enums\RoomStatus;
use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            [
                'room_number' => '101',
                'room_type' => 'Standard',
                'description' => 'A comfortable standard room with a queen bed, workspace, and city views. Ideal for solo travellers and couples.',
                'price_per_night' => '89.00',
                'capacity' => 2,
                'image' => 'images/rooms/standard.svg',
                'status' => RoomStatus::Available,
            ],
            [
                'room_number' => '102',
                'room_type' => 'Standard',
                'description' => 'Quiet garden-facing standard room with twin beds, rainfall shower, and complimentary tea service.',
                'price_per_night' => '95.00',
                'capacity' => 2,
                'image' => 'images/rooms/standard.svg',
                'status' => RoomStatus::Available,
            ],
            [
                'room_number' => '201',
                'room_type' => 'Deluxe',
                'description' => 'Spacious deluxe room with a king bed, lounge chair, and upgraded amenities for a relaxing stay.',
                'price_per_night' => '149.00',
                'capacity' => 2,
                'image' => 'images/rooms/deluxe.svg',
                'status' => RoomStatus::Available,
            ],
            [
                'room_number' => '202',
                'room_type' => 'Deluxe',
                'description' => 'Deluxe double room with a seating area, work desk, and panoramic windows overlooking the boulevard.',
                'price_per_night' => '159.00',
                'capacity' => 3,
                'image' => 'images/rooms/deluxe.svg',
                'status' => RoomStatus::Available,
            ],
            [
                'room_number' => '301',
                'room_type' => 'Suite',
                'description' => 'Elegant suite with a separate living room, king bedroom, and luxury bathroom with a soaking tub.',
                'price_per_night' => '249.00',
                'capacity' => 3,
                'image' => 'images/rooms/suite.svg',
                'status' => RoomStatus::Available,
            ],
            [
                'room_number' => '401',
                'room_type' => 'Family',
                'description' => 'Family room with one king bed and two twins, extra storage, and space for up to four guests.',
                'price_per_night' => '199.00',
                'capacity' => 4,
                'image' => 'images/rooms/family.svg',
                'status' => RoomStatus::Available,
            ],
            [
                'room_number' => '501',
                'room_type' => 'Executive',
                'description' => 'Executive room with a large desk, fast Wi-Fi, espresso machine, and access to the business lounge.',
                'price_per_night' => '219.00',
                'capacity' => 2,
                'image' => 'images/rooms/executive.svg',
                'status' => RoomStatus::Available,
            ],
            [
                'room_number' => '110',
                'room_type' => 'Standard',
                'description' => 'Temporarily closed for renovation. This room is listed so administrators can demonstrate maintenance status.',
                'price_per_night' => '89.00',
                'capacity' => 2,
                'image' => 'images/rooms/placeholder.svg',
                'status' => RoomStatus::Maintenance,
            ],
        ];

        foreach ($rooms as $room) {
            Room::query()->updateOrCreate(
                ['room_number' => $room['room_number']],
                $room
            );
        }
    }
}
