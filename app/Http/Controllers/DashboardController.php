<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __invoke(Request $request, BookingService $bookings): View
    {
        $bookings->markCompletedStays();

        $user = $request->user();

        $stats = [
            'total' => $user->bookings()->count(),
            'pending' => $user->bookings()->where('status', BookingStatus::Pending)->count(),
            'confirmed' => $user->bookings()->where('status', BookingStatus::Confirmed)->count(),
            'cancelled' => $user->bookings()->where('status', BookingStatus::Cancelled)->count(),
        ];

        $upcoming = $user->bookings()
            ->with('room')
            ->whereIn('status', [BookingStatus::Pending, BookingStatus::Confirmed])
            ->orderBy('check_in')
            ->limit(5)
            ->get();

        return view('dashboard', compact('stats', 'upcoming'));
    }
}
