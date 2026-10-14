@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="container py-4">
    <p class="section-kicker">Customer</p>
    <h1 class="mb-4">Hello, {{ auth()->user()->name }}</h1>

    <div class="row g-3 mb-4">
        <div class="col-md-3"><div class="stat-card"><div class="text-muted">Total bookings</div><div class="stat-value">{{ $stats['total'] }}</div></div></div>
        <div class="col-md-3"><div class="stat-card"><div class="text-muted">Pending</div><div class="stat-value">{{ $stats['pending'] }}</div></div></div>
        <div class="col-md-3"><div class="stat-card"><div class="text-muted">Confirmed</div><div class="stat-value">{{ $stats['confirmed'] }}</div></div></div>
        <div class="col-md-3"><div class="stat-card"><div class="text-muted">Cancelled</div><div class="stat-value">{{ $stats['cancelled'] }}</div></div></div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Upcoming stays</h2>
        <a href="{{ route('rooms.index') }}" class="btn btn-gold btn-sm">Book a room</a>
    </div>

    @forelse ($upcoming as $booking)
        <div class="panel-card p-3 mb-3 d-flex justify-content-between flex-wrap gap-2">
            <div>
                <strong>Room {{ $booking->room->room_number }}</strong> · {{ $booking->room->room_type }}<br>
                {{ $booking->check_in->toFormattedDateString() }} – {{ $booking->check_out->toFormattedDateString() }}
            </div>
            <div class="d-flex align-items-center gap-2">
                <x-status-badge :status="$booking->status" />
                <a href="{{ route('bookings.show', $booking) }}">Details</a>
            </div>
        </div>
    @empty
        <div class="empty-state">You have no upcoming bookings. Browse rooms to make a reservation.</div>
    @endforelse
</div>
@endsection
