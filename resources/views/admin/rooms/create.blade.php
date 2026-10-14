@extends('layouts.admin')

@section('title', 'Add room')

@section('content')
<h1 class="h3 mb-4">Add room</h1>
<div class="panel-card p-4" style="max-width: 760px;">
    <form method="POST" action="{{ route('admin.rooms.store') }}" enctype="multipart/form-data">
        @include('admin.rooms._form', ['submitLabel' => 'Save room'])
    </form>
</div>
@endsection
