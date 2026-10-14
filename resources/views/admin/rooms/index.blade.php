@extends('layouts.admin')

@section('title', 'Rooms')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Rooms</h1>
    <a href="{{ route('admin.rooms.create') }}" class="btn btn-gold">Add room</a>
</div>

<div class="panel-card p-3">
    <div class="table-responsive">
        <table class="table align-middle mb-0">
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($rooms as $room)
                    <tr>
                        <td>{{ $room->room_number }}</td>
                        <td>{{ $room->room_type }}</td>
                        <td>${{ number_format($room->price_per_night, 2) }}</td>
                        <td>{{ $room->capacity }}</td>
                        <td>{{ $room->status->label() }}</td>
                        <td class="d-flex gap-2">
                            <a href="{{ route('admin.rooms.edit', $room) }}">Edit</a>
                            <form method="POST" action="{{ route('admin.rooms.destroy', $room) }}" onsubmit="return confirm('Delete this room?');">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-link btn-sm text-danger p-0" type="submit">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="6" class="text-muted">No rooms yet.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
<div class="mt-3">{{ $rooms->links() }}</div>
@endsection
