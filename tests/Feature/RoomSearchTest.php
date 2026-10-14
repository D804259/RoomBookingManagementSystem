<?php

namespace Tests\Feature;

use App\Enums\RoomStatus;
use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_rooms_can_be_filtered_by_type_price_and_capacity(): void
    {
        Room::factory()->create([
            'room_number' => '201',
            'room_type' => 'Deluxe',
            'description' => 'Quiet deluxe king room with a lounge chair.',
            'price_per_night' => '150.00',
            'capacity' => 3,
            'status' => RoomStatus::Available,
        ]);

        Room::factory()->create([
            'room_number' => '101',
            'room_type' => 'Standard',
            'description' => 'Compact twin room near the lobby.',
            'price_per_night' => '80.00',
            'capacity' => 1,
            'status' => RoomStatus::Available,
        ]);

        Room::factory()->maintenance()->create([
            'room_type' => 'Deluxe',
            'price_per_night' => '140.00',
            'capacity' => 4,
        ]);

        $this->get(route('rooms.index', [
            'room_type' => 'Deluxe',
            'max_price' => '200',
            'guests' => 2,
        ]))
            ->assertOk()
            ->assertSee('Room 201')
            ->assertDontSee('Room 101');
    }
}
