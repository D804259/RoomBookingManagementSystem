<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
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

        $bookings = Booking::query()
            ->with(['user', 'room'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('customer'), function ($query) use ($request) {
                $search = $request->string('customer')->toString();
                $query->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                });
            })
            ->when($request->filled('room_number'), function ($query) use ($request) {
                $query->whereHas('room', fn ($roomQuery) => $roomQuery->where('room_number', 'like', '%'.$request->string('room_number').'%'));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.bookings.index', [
            'bookings' => $bookings,
            'statuses' => BookingStatus::cases(),
            'filters' => $request->only(['status', 'customer', 'room_number']),
        ]);
    }

    public function show(Booking $booking): View
    {
        $booking->load(['user', 'room']);

        return view('admin.bookings.show', compact('booking'));
    }

    public function approve(Booking $booking): RedirectResponse
    {
        $this->bookings->approve($booking);

        return back()->with('success', 'Booking approved and confirmed.');
    }

    public function reject(Booking $booking): RedirectResponse
    {
        $this->bookings->reject($booking);

        return back()->with('success', 'Booking rejected. The dates are now free.');
    }

    public function cancel(Booking $booking): RedirectResponse
    {
        $this->bookings->cancel($booking, byAdmin: true);

        return back()->with('success', 'Booking cancelled.');
    }
}
