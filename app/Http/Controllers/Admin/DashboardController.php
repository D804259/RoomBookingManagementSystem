<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __invoke(BookingService $bookings): View
    {
        $bookings->markCompletedStays();

        $stats = [
            'rooms' => Room::query()->count(),
            'customers' => User::query()->where('role', UserRole::Customer)->count(),
            'bookings' => Booking::query()->count(),
            'pending' => Booking::query()->where('status', BookingStatus::Pending)->count(),
            'confirmed' => Booking::query()->where('status', BookingStatus::Confirmed)->count(),
        ];

        $recentBookings = Booking::query()
            ->with(['user', 'room'])
            ->latest()
            ->limit(8)
            ->get();

        return view('admin.dashboard', compact('stats', 'recentBookings'));
    }
}
