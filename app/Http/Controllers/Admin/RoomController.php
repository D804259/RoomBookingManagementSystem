<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RoomStatus;
use App\Enums\RoomType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class RoomController extends Controller
{
    public function index(): View
    {
        $rooms = Room::query()->orderBy('room_number')->paginate(12);

        return view('admin.rooms.index', compact('rooms'));
    }

    public function create(): View
    {
        return view('admin.rooms.create', [
            'roomTypes' => RoomType::values(),
            'statuses' => RoomStatus::cases(),
        ]);
    }

    public function store(StoreRoomRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('rooms', 'public');
        }

        Room::query()->create($data);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Room added successfully.');
    }

    public function edit(Room $room): View
    {
        return view('admin.rooms.edit', [
            'room' => $room,
            'roomTypes' => RoomType::values(),
            'statuses' => RoomStatus::cases(),
        ]);
    }

    public function update(UpdateRoomRequest $request, Room $room): RedirectResponse
    {
        $data = $request->safe()->except('image');

        if ($request->hasFile('image')) {
            $this->deleteStoredImage($room);
            $data['image'] = $request->file('image')->store('rooms', 'public');
        }

        $room->update($data);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Room updated successfully.');
    }

    public function destroy(Room $room): RedirectResponse
    {
        if ($room->hasActiveBookings()) {
            return back()->with('error', 'This room has pending or confirmed bookings and cannot be deleted.');
        }

        $this->deleteStoredImage($room);
        $room->delete();

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Room deleted successfully.');
    }

    private function deleteStoredImage(Room $room): void
    {
        if ($room->image && ! str_starts_with($room->image, 'images/') && ! str_starts_with($room->image, 'http')) {
            Storage::disk('public')->delete($room->image);
        }
    }
}
