@extends('layouts.app')

@section('title', 'Booking #'.$booking->id)

@section('content')
<div class="container py-4" style="max-width: 720px;">
    <div class="panel-card p-4">
        <p class="section-kicker">Booking #{{ $booking->id }}</p>
        <h1 class="h3">Room {{ $booking->room->room_number }}</h1>
        <p><x-status-badge :status="$booking->status" /></p>
        <dl class="row">
            <dt class="col-sm-4">Type</dt><dd class="col-sm-8">{{ $booking->room->room_type }}</dd>
            <dt class="col-sm-4">Check-in</dt><dd class="col-sm-8">{{ $booking->check_in->toFormattedDateString() }}</dd>
            <dt class="col-sm-4">Check-out</dt><dd class="col-sm-8">{{ $booking->check_out->toFormattedDateString() }}</dd>
            <dt class="col-sm-4">Nights</dt><dd class="col-sm-8">{{ $booking->nights() }}</dd>
            <dt class="col-sm-4">Guests</dt><dd class="col-sm-8">{{ $booking->guests }}</dd>
            <dt class="col-sm-4">Total</dt><dd class="col-sm-8">${{ number_format($booking->total_price, 2) }}</dd>
        </dl>
        @can('cancel', $booking)
            <form method="POST" action="{{ route('bookings.cancel', $booking) }}" onsubmit="return confirm('Cancel this booking?');">
                @csrf
                <button class="btn btn-outline-danger" type="submit">Cancel booking</button>
            </form>
        @endcan
        <a href="{{ route('bookings.index') }}" class="d-inline-block mt-3">Back to history</a>
    </div>
</div>
@endsection
