@extends('layouts.app')

@section('title', 'Rooms')

@section('content')
<div class="container py-4">
    <p class="section-kicker">Accommodation</p>
    <h1 class="mb-4">Available rooms</h1>

    <form method="GET" class="panel-card p-4 mb-4">
        <div class="row g-3 align-items-end">
            <div class="col-md-3">
                <label class="form-label">Room type</label>
                <select name="room_type" class="form-select">
                    <option value="">Any type</option>
                    @foreach ($roomTypes as $type)
                        <option value="{{ $type }}" @selected(($filters['room_type'] ?? '') === $type)>{{ $type }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Max price / night</label>
                <input type="number" min="1" step="0.01" name="max_price" value="{{ $filters['max_price'] ?? '' }}" class="form-control">
            </div>
            <div class="col-md-3">
                <label class="form-label">Guest capacity</label>
                <input type="number" min="1" max="20" name="guests" value="{{ $filters['guests'] ?? '' }}" class="form-control">
            </div>
            <div class="col-md-3 d-flex gap-2">
                <button class="btn btn-navy flex-grow-1" type="submit">Filter</button>
                <a href="{{ route('rooms.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </div>
    </form>

    <div class="row g-4">
        @forelse ($rooms as $room)
            <div class="col-md-6 col-lg-4">
                <x-room-card :room="$room" />
            </div>
        @empty
            <div class="col-12">
                <div class="empty-state">No rooms match your search. Try a different type, price, or guest count.</div>
            </div>
        @endforelse
    </div>

    <div class="mt-4">{{ $rooms->links() }}</div>
</div>
@endsection
