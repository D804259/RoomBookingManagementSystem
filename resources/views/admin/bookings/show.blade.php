@extends('layouts.admin')

@section('title', 'Booking #'.$booking->id)

@section('content')
<div class="panel-card p-4" style="max-width: 760px;">
    <h1 class="h3">Booking #{{ $booking->id }}</h1>
    <p><x-status-badge :status="$booking->status" /></p>
    <dl class="row">
        <dt class="col-sm-4">Customer</dt><dd class="col-sm-8">{{ $booking->user->name }} ({{ $booking->user->email }})</dd>
        <dt class="col-sm-4">Room</dt><dd class="col-sm-8">{{ $booking->room->room_number }} · {{ $booking->room->room_type }}</dd>
        <dt class="col-sm-4">Check-in</dt><dd class="col-sm-8">{{ $booking->check_in->toFormattedDateString() }}</dd>
        <dt class="col-sm-4">Check-out</dt><dd class="col-sm-8">{{ $booking->check_out->toFormattedDateString() }}</dd>
        <dt class="col-sm-4">Guests</dt><dd class="col-sm-8">{{ $booking->guests }}</dd>
        <dt class="col-sm-4">Total</dt><dd class="col-sm-8">${{ number_format($booking->total_price, 2) }}</dd>
    </dl>
    <div class="d-flex flex-wrap gap-2">
        @if ($booking->isApprovable())
            <form method="POST" action="{{ route('admin.bookings.approve', $booking) }}">
                @csrf
                <button class="btn btn-success" type="submit">Approve</button>
            </form>
            <form method="POST" action="{{ route('admin.bookings.reject', $booking) }}">
                @csrf
                <button class="btn btn-outline-danger" type="submit">Reject</button>
            </form>
        @endif
        @if ($booking->isCancellableByAdmin())
            <form method="POST" action="{{ route('admin.bookings.cancel', $booking) }}">
                @csrf
                <button class="btn btn-outline-secondary" type="submit">Cancel</button>
            </form>
        @endif
    </div>
</div>
@endsection
