@extends('layouts.app')

@section('title', 'Room '.$room->room_number)

@section('content')
<div class="container py-4">
    <div class="row g-4">
        <div class="col-lg-7">
            <img src="{{ $room->imageUrl() }}" alt="Room {{ $room->room_number }}" class="room-photo rounded-4 w-100" style="height: 380px;">
            <p class="section-kicker mt-4">{{ $room->room_type }}</p>
            <h1>Room {{ $room->room_number }}</h1>
            <p class="lead">{{ $room->description }}</p>
            <ul class="list-unstyled">
                <li>Capacity: <strong>{{ $room->capacity }} guests</strong></li>
                <li>Price: <strong class="price-tag">${{ number_format($room->price_per_night, 2) }}</strong> per night</li>
                <li>Status: <strong>{{ $room->status->label() }}</strong></li>
            </ul>
        </div>
        <div class="col-lg-5">
            <div class="panel-card p-4">
                <h2 class="h4 mb-3">Check availability</h2>
                @if (! $room->isAvailableForBooking())
                    <div class="alert alert-warning">This room is under maintenance and cannot be booked.</div>
                @endif

                <form method="GET" action="{{ route('rooms.show', $room) }}" class="mb-3">
                    <div class="mb-3">
                        <label class="form-label">Check-in</label>
                        <input type="date" name="check_in" value="{{ $checkIn }}" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Check-out</label>
                        <input type="date" name="check_out" value="{{ $checkOut }}" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Guests</label>
                        <input type="number" min="1" max="{{ $room->capacity }}" name="guests" value="{{ $guests }}" class="form-control" required>
                    </div>
                    <button class="btn btn-outline-secondary w-100" type="submit">Check availability</button>
                </form>

                @if ($availability === true)
                    <div class="alert alert-success">This room is available for the selected dates.</div>
                    @if ($nights)
                        <p>Stay: <strong>{{ $nights }} night(s)</strong><br>
                        Estimated total: <strong>${{ number_format($previewTotal, 2) }}</strong> (confirmed on the server when you book)</p>
                    @endif
                @elseif ($availability === false)
                    <div class="alert alert-danger">This room is not available for those dates or that guest count.</div>
                @endif

                @auth
                    @if ($room->isAvailableForBooking())
                        <form method="POST" action="{{ route('bookings.store', $room) }}">
                            @csrf
                            <input type="hidden" name="check_in" value="{{ $checkIn }}">
                            <input type="hidden" name="check_out" value="{{ $checkOut }}">
                            <input type="hidden" name="guests" value="{{ $guests }}">
                            <button class="btn btn-gold w-100" type="submit" @disabled(! $checkIn || ! $checkOut)>Book now</button>
                        </form>
                    @endif
                @else
                    <a href="{{ route('login') }}" class="btn btn-gold w-100">Sign in to book</a>
                @endauth
            </div>
        </div>
    </div>
</div>
@endsection
