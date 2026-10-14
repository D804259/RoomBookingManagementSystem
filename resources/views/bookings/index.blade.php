@extends('layouts.app')

@section('title', 'My bookings')

@section('content')
<div class="container py-4">
    <p class="section-kicker">Customer</p>
    <h1 class="mb-4">Booking history</h1>

    <div class="panel-card p-3">
        <div class="table-responsive">
            <table class="table align-middle mb-0">
                <thead>
                    <tr>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Guests</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($bookings as $booking)
                        <tr>
                            <td>{{ $booking->room->room_number }} · {{ $booking->room->room_type }}</td>
                            <td>{{ $booking->check_in->toFormattedDateString() }} – {{ $booking->check_out->toFormattedDateString() }}</td>
                            <td>{{ $booking->guests }}</td>
                            <td>${{ number_format($booking->total_price, 2) }}</td>
                            <td><x-status-badge :status="$booking->status" /></td>
                            <td><a href="{{ route('bookings.show', $booking) }}">View</a></td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">You have not made any bookings yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    <div class="mt-3">{{ $bookings->links() }}</div>
</div>
@endsection
