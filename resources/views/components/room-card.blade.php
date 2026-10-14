@props(['room'])

<article class="card room-card">
    <img src="{{ $room->imageUrl() }}" alt="Room {{ $room->room_number }}">
    <div class="card-body">
        <p class="section-kicker mb-1">{{ $room->room_type }} · {{ $room->capacity }} guests</p>
        <h3 class="h5">Room {{ $room->room_number }}</h3>
        <p class="text-muted">{{ \Illuminate\Support\Str::limit($room->description, 110) }}</p>
        <div class="d-flex justify-content-between align-items-center">
            <span class="price-tag">${{ number_format($room->price_per_night, 2) }} / night</span>
            <a href="{{ route('rooms.show', $room) }}" class="btn btn-navy btn-sm">View details</a>
        </div>
    </div>
</article>
