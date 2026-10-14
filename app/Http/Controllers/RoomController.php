<?php

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Enums\RoomType;
use App\Models\Room;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RoomController extends Controller
{
    public function index(Request $request): View
    {
        $rooms = Room::query()
            ->where('status', RoomStatus::Available)
            ->search(
                $request->string('room_type')->toString() ?: null,
                $request->input('max_price'),
                $request->input('guests')
            )
            ->orderBy('price_per_night')
            ->paginate(9)
            ->withQueryString();

        return view('rooms.index', [
            'rooms' => $rooms,
            'roomTypes' => RoomType::values(),
            'filters' => $request->only(['room_type', 'max_price', 'guests']),
        ]);
    }

    public function show(Request $request, Room $room, BookingService $bookings): View
    {
        $checkIn = $request->string('check_in')->toString();
        $checkOut = $request->string('check_out')->toString();
        $guests = (int) $request->input('guests', 1);

        $availability = null;
        $previewTotal = null;
        $nights = null;

        if ($checkIn !== '' && $checkOut !== '') {
            $availability = $bookings->isAvailable($room, $checkIn, $checkOut, max($guests, 1));

            try {
                $bookings->assertStayDates($checkIn, $checkOut);
                $nights = $bookings->nights($checkIn, $checkOut);
                $previewTotal = $bookings->calculateTotal($room, $nights);
            } catch (\Illuminate\Validation\ValidationException) {
                $previewTotal = null;
                $nights = null;
            }
        }

        return view('rooms.show', [
            'room' => $room,
            'availability' => $availability,
            'previewTotal' => $previewTotal,
            'nights' => $nights,
            'checkIn' => $checkIn,
            'checkOut' => $checkOut,
            'guests' => $guests > 0 ? $guests : 1,
        ]);
    }

    public function availability(Request $request, Room $room, BookingService $bookings): JsonResponse
    {
        $validated = $request->validate([
            'check_in' => ['required', 'date', 'after:today'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        $available = $bookings->isAvailable(
            $room,
            $validated['check_in'],
            $validated['check_out'],
            (int) $validated['guests']
        );

        $nights = $bookings->nights($validated['check_in'], $validated['check_out']);

        return response()->json([
            'available' => $available,
            'nights' => $nights,
            'total_price' => $bookings->calculateTotal($room, $nights),
            'message' => $available
                ? 'This room is available for your selected dates.'
                : 'This room is not available for the selected dates or guest count.',
        ]);
    }
}
