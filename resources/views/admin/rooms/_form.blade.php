@csrf
<div class="mb-3">
    <label class="form-label">Room number</label>
    <input type="text" name="room_number" value="{{ old('room_number', $room?->room_number) }}" class="form-control" required>
</div>
<div class="mb-3">
    <label class="form-label">Room type</label>
    <select name="room_type" class="form-select" required>
        @foreach ($roomTypes as $type)
            <option value="{{ $type }}" @selected(old('room_type', $room?->room_type) === $type)>{{ $type }}</option>
        @endforeach
    </select>
</div>
<div class="mb-3">
    <label class="form-label">Description</label>
    <textarea name="description" rows="4" class="form-control" required>{{ old('description', $room?->description) }}</textarea>
</div>
<div class="row">
    <div class="col-md-4 mb-3">
        <label class="form-label">Price per night</label>
        <input type="number" step="0.01" min="1" name="price_per_night" value="{{ old('price_per_night', $room?->price_per_night) }}" class="form-control" required>
    </div>
    <div class="col-md-4 mb-3">
        <label class="form-label">Capacity</label>
        <input type="number" min="1" max="20" name="capacity" value="{{ old('capacity', $room?->capacity ?? 2) }}" class="form-control" required>
    </div>
    <div class="col-md-4 mb-3">
        <label class="form-label">Maintenance status</label>
        <select name="status" class="form-select" required>
            @foreach ($statuses as $status)
                <option value="{{ $status->value }}" @selected(old('status', $room?->status?->value ?? 'available') === $status->value)>{{ $status->label() }}</option>
            @endforeach
        </select>
    </div>
</div>
<div class="mb-3">
    <label class="form-label">Room image (JPG, PNG, or WebP, max 2MB)</label>
    <input type="file" name="image" accept="image/jpeg,image/png,image/webp" class="form-control">
</div>
<button class="btn btn-navy" type="submit">{{ $submitLabel }}</button>
