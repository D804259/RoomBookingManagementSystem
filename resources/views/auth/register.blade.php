@extends('layouts.app')

@section('title', 'Register')

@section('content')
<div class="container py-5" style="max-width: 480px;">
    <div class="auth-card p-4 p-md-5">
        <p class="section-kicker">Account</p>
        <h1 class="h3 mb-4">Create a customer account</h1>
        <form method="POST" action="{{ route('register') }}">
            @csrf
            <div class="mb-3">
                <label class="form-label">Full name</label>
                <input type="text" name="name" value="{{ old('name') }}" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Confirm password</label>
                <input type="password" name="password_confirmation" class="form-control" required>
            </div>
            <button class="btn btn-gold w-100" type="submit">Register</button>
        </form>
        <p class="mt-3 mb-0">Already registered? <a href="{{ route('login') }}">Sign in</a></p>
    </div>
</div>
@endsection
