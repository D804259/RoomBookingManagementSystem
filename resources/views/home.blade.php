@extends('layouts.app')

@section('title', 'Welcome')

@section('content')
<section class="hero">
    <div class="container">
        <p class="section-kicker text-warning">Boutique hotel · Harbour district</p>
        <h1>Reserve a room with confirmed availability.</h1>
        <p class="lead col-lg-7">Browse rooms, choose your dates, and submit a booking. Every stay is checked on the server so the same room cannot be double-booked.</p>
        <a href="{{ route('rooms.index') }}" class="btn btn-gold btn-lg mt-2">Browse rooms</a>
    </div>
</section>

<div class="container">
    <form action="{{ route('rooms.index') }}" method="GET" class="search-panel p-4 p-md-5">
        <div class="row g-3 align-items-end">
            <div class="col-md-3">
                <label class="form-label">Room type</label>
                <select name="room_type" class="form-select">
                    <option value="">Any type</option>
                    @foreach ($roomTypes as $type)
                        <option value="{{ $type }}">{{ $type }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Max price / night</label>
                <input type="number" min="1" step="0.01" name="max_price" class="form-control" placeholder="e.g. 200">
            </div>
            <div class="col-md-3">
                <label class="form-label">Guests</label>
                <input type="number" min="1" max="20" name="guests" class="form-control" placeholder="1">
            </div>
            <div class="col-md-3">
                <button type="submit" class="btn btn-navy w-100">Search rooms</button>
            </div>
        </div>
    </form>
</div>

<section class="container py-5">
    <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
            <p class="section-kicker mb-1">Stay with us</p>
            <h2>Featured rooms</h2>
        </div>
        <a href="{{ route('rooms.index') }}">View all</a>
    </div>
    <div class="row g-4">
        @forelse ($featuredRooms as $room)
            <div class="col-md-6 col-lg-4">
                <x-room-card :room="$room" />
            </div>
        @empty
            <div class="col-12">
                <div class="empty-state">No rooms have been added yet. Ask an administrator to add rooms, or run the database seeder.</div>
            </div>
        @endforelse
    </div>
</section>
@endsection
