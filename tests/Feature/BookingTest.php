<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_pending_booking_using_the_database_price(): void
    {
        $user = User::factory()->create();
        $room = Room::factory()->create([
            'price_per_night' => '100.00',
            'capacity' => 2,
        ]);

        $checkIn = Carbon::tomorrow()->toDateString();
        $checkOut = Carbon::tomorrow()->addDays(3)->toDateString();

        $this->actingAs($user)
            ->post(route('bookings.store', $room), [
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'guests' => 2,
                'total_price' => '1.00',
            ])
            ->assertRedirect();

        $booking = Booking::query()->first();
        $this->assertNotNull($booking);
        $this->assertSame('300.00', $booking->total_price);
        $this->assertSame(BookingStatus::Pending, $booking->status);
        $this->assertSame($user->id, $booking->user_id);
    }

    public function test_overlapping_pending_bookings_are_rejected(): void
    {
        $room = Room::factory()->create(['capacity' => 2]);
        $first = User::factory()->create();
        $second = User::factory()->create();

        $checkIn = Carbon::tomorrow()->addDay()->toDateString();
        $checkOut = Carbon::tomorrow()->addDays(4)->toDateString();

        Booking::factory()->for($first)->for($room)->create([
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'status' => BookingStatus::Pending,
        ]);

        $this->actingAs($second)
            ->from(route('rooms.show', $room))
            ->post(route('bookings.store', $room), [
                'check_in' => Carbon::tomorrow()->addDays(2)->toDateString(),
                'check_out' => Carbon::tomorrow()->addDays(5)->toDateString(),
                'guests' => 1,
            ])
            ->assertSessionHasErrors('check_in');

        $this->assertSame(1, Booking::query()->count());
    }

    public function test_guest_count_cannot_exceed_capacity(): void
    {
        $user = User::factory()->create();
        $room = Room::factory()->create(['capacity' => 2]);

        $this->actingAs($user)
            ->post(route('bookings.store', $room), [
                'check_in' => Carbon::tomorrow()->toDateString(),
                'check_out' => Carbon::tomorrow()->addDays(2)->toDateString(),
                'guests' => 5,
            ])
            ->assertSessionHasErrors('guests');
    }

    public function test_admin_can_approve_a_pending_booking(): void
    {
        $admin = User::factory()->admin()->create();
        $booking = Booking::factory()->create();

        $this->actingAs($admin)
            ->post(route('admin.bookings.approve', $booking))
            ->assertRedirect();

        $this->assertSame(BookingStatus::Confirmed, $booking->fresh()->status);
    }

    public function test_customers_can_cancel_future_pending_bookings(): void
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->for($user)->create([
            'check_in' => Carbon::tomorrow()->addDays(2)->toDateString(),
            'check_out' => Carbon::tomorrow()->addDays(4)->toDateString(),
            'status' => BookingStatus::Pending,
        ]);

        $this->actingAs($user)
            ->post(route('bookings.cancel', $booking))
            ->assertRedirect(route('bookings.index'));

        $this->assertSame(BookingStatus::Cancelled, $booking->fresh()->status);
    }

    public function test_cancelled_bookings_do_not_block_new_reservations(): void
    {
        $room = Room::factory()->create();
        $user = User::factory()->create();

        $checkIn = Carbon::tomorrow()->addDay()->toDateString();
        $checkOut = Carbon::tomorrow()->addDays(3)->toDateString();

        Booking::factory()->for($room)->create([
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'status' => BookingStatus::Cancelled,
        ]);

        $this->actingAs($user)
            ->post(route('bookings.store', $room), [
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'guests' => 1,
            ])
            ->assertRedirect();

        $this->assertSame(2, Booking::query()->count());
    }
}
