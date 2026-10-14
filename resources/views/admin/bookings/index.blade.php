@extends('layouts.admin')

@section('title', 'Bookings')

@section('content')
<h1 class="h3 mb-4">All bookings</h1>

<form method="GET" class="panel-card p-3 mb-3">
    <div class="row g-2 align-items-end">
        <div class="col-md-3">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
                <option value="">All</option>
                @foreach ($statuses as $status)
                    <option value="{{ $status->value }}" @selected(($filters['status'] ?? '') === $status->value)>{{ $status->label() }}</option>
                @endforeach
            </select>
        </div>
        <div class="col-md-3">
            <label class="form-label">Customer</label>
            <input type="text" name="customer" value="{{ $filters['customer'] ?? '' }}" class="form-control" placeholder="Name or email">
        </div>
        <div class="col-md-3">
            <label class="form-label">Room number</label>
            <input type="text" name="room_number" value="{{ $filters['room_number'] ?? '' }}" class="form-control">
        </div>
        <div class="col-md-3">
            <button class="btn btn-navy w-100" type="submit">Filter</button>
        </div>
    </div>
</form>

<div class="panel-card p-3">
    <div class="table-responsive">
        <table class="table align-middle mb-0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($bookings as $booking)
                    <tr>
                        <td>#{{ $booking->id }}</td>
                        <td>{{ $booking->user->name }}</td>
                        <td>{{ $booking->room->room_number }}</td>
                        <td>{{ $booking->check_in->toFormattedDateString() }} – {{ $booking->check_out->toFormattedDateString() }}</td>
                        <td>${{ number_format($booking->total_price, 2) }}</td>
                        <td><x-status-badge :status="$booking->status" /></td>
                        <td><a href="{{ route('admin.bookings.show', $booking) }}">Manage</a></td>
                    </tr>
                @empty
                    <tr><td colspan="7" class="text-muted">No bookings found.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
<div class="mt-3">{{ $bookings->links() }}</div>
@endsection
