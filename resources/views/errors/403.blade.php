@extends('layouts.app')

@section('title', 'Not authorized')

@section('content')
<div class="container py-5">
    <div class="empty-state">
        <h1 class="h3">Access denied</h1>
        <p>You are not authorized to view this page.</p>
        <a href="{{ route('home') }}" class="btn btn-navy">Back to home</a>
    </div>
</div>
@endsection
