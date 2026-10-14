@extends('layouts.admin')

@section('title', 'Edit room')

@section('content')
<h1 class="h3 mb-4">Edit room {{ $room->room_number }}</h1>
<div class="panel-card p-4" style="max-width: 760px;">
    @if ($room->image)
        <img src="{{ $room->imageUrl() }}" alt="" class="rounded mb-3" style="height: 160px;">
    @endif
    <form method="POST" action="{{ route('admin.rooms.update', $room) }}" enctype="multipart/form-data">
        @method('PUT')
        @include('admin.rooms._form', ['submitLabel' => 'Update room'])
    </form>
</div>
@endsection
