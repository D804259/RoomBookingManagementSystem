<?php

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Enums\RoomType;
use App\Models\Room;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function __invoke(): View
    {
        $featuredRooms = Room::query()
            ->where('status', RoomStatus::Available)
            ->orderBy('price_per_night')
            ->limit(6)
            ->get();

        return view('home', [
            'featuredRooms' => $featuredRooms,
            'roomTypes' => RoomType::values(),
        ]);
    }
}
