@extends('layouts.admin')

@section('title', $customer->name)

@section('content')
<div class="panel-card p-4 mb-4">
    <h1 class="h3">{{ $customer->name }}</h1>
    <p class="mb-0">{{ $customer->email }}</p>
    <p class="text-muted">Joined {{ $customer->created_at->toFormattedDateString() }}</p>
</div>
<div class="panel-card p-3">
    <h2 class="h5">Bookings</h2>
    <table class="table">
        <thead>
            <tr>
                <th>Room</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($customer->bookings as $booking)
                <tr>
                    <td>{{ $booking->room->room_number }}</td>
                    <td>{{ $booking->check_in->toFormattedDateString() }} – {{ $booking->check_out->toFormattedDateString() }}</td>
                    <td><x-status-badge :status="$booking->status" /></td>
                    <td>${{ number_format($booking->total_price, 2) }}</td>
                </tr>
            @empty
                <tr><td colspan="4" class="text-muted">No bookings.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection
