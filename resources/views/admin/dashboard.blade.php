@extends('layouts.admin')

@section('title', 'Admin dashboard')

@section('content')
<p class="section-kicker">Overview</p>
<h1 class="mb-4">Hotel operations</h1>

<div class="row g-3 mb-4">
    <div class="col-md-4 col-xl"><div class="stat-card"><div class="text-muted">Total rooms</div><div class="stat-value">{{ $stats['rooms'] }}</div></div></div>
    <div class="col-md-4 col-xl"><div class="stat-card"><div class="text-muted">Customers</div><div class="stat-value">{{ $stats['customers'] }}</div></div></div>
    <div class="col-md-4 col-xl"><div class="stat-card"><div class="text-muted">Total bookings</div><div class="stat-value">{{ $stats['bookings'] }}</div></div></div>
    <div class="col-md-4 col-xl"><div class="stat-card"><div class="text-muted">Pending</div><div class="stat-value">{{ $stats['pending'] }}</div></div></div>
    <div class="col-md-4 col-xl"><div class="stat-card"><div class="text-muted">Confirmed</div><div class="stat-value">{{ $stats['confirmed'] }}</div></div></div>
</div>

<div class="panel-card p-3">
    <h2 class="h5 mb-3">Recent bookings</h2>
    <div class="table-responsive">
        <table class="table align-middle mb-0">
            <thead>
                <tr>
                    <th>Customer</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($recentBookings as $booking)
                    <tr>
                        <td>{{ $booking->user->name }}</td>
                        <td>{{ $booking->room->room_number }}</td>
                        <td>{{ $booking->check_in->toFormattedDateString() }}</td>
                        <td><x-status-badge :status="$booking->status" /></td>
                        <td><a href="{{ route('admin.bookings.show', $booking) }}">Open</a></td>
                    </tr>
                @empty
                    <tr><td colspan="5" class="text-muted">No bookings yet.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
