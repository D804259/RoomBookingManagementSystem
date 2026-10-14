<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Services\BookingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookings) {}

    public function index(Request $request): View
    {
        $this->bookings->markCompletedStays();

        $bookings = $request->user()
            ->bookings()
            ->with('room')
            ->latest()
            ->paginate(10);

        return view('bookings.index', compact('bookings'));
    }

    public function show(Request $request, Booking $booking): View
    {
        $this->authorize('view', $booking);

        $booking->load('room');

        return view('bookings.show', compact('booking'));
    }

    public function store(StoreBookingRequest $request, Room $room): RedirectResponse
    {
        $booking = $this->bookings->create(
            $request->user(),
            $room,
            $request->validated('check_in'),
            $request->validated('check_out'),
            (int) $request->validated('guests')
        );

        return redirect()
            ->route('bookings.show', $booking)
            ->with('success', 'Your booking request has been submitted and is pending confirmation.');
    }

    public function cancel(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorize('cancel', $booking);

        $this->bookings->cancel($booking, byAdmin: false);

        return redirect()
            ->route('bookings.index')
            ->with('success', 'Your booking has been cancelled.');
    }
}
