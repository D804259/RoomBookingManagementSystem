<?php

namespace Database\Factories;

use App\Enums\RoomStatus;
use App\Enums\RoomType;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'room_number' => (string) fake()->unique()->numberBetween(100, 999),
            'room_type' => fake()->randomElement(RoomType::values()),
            'description' => fake()->paragraph(),
            'price_per_night' => fake()->randomElement(['89.00', '129.00', '189.00', '249.00', '329.00']),
            'capacity' => fake()->numberBetween(1, 4),
            'image' => 'images/rooms/placeholder.svg',
            'status' => RoomStatus::Available,
        ];
    }

    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => RoomStatus::Maintenance,
        ]);
    }
}
