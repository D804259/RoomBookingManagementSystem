@extends('layouts.app')

@section('title', 'Sign in')

@section('content')
<div class="container py-5" style="max-width: 480px;">
    <div class="auth-card p-4 p-md-5">
        <p class="section-kicker">Account</p>
        <h1 class="h3 mb-4">Sign in</h1>
        <form method="POST" action="{{ route('login') }}">
            @csrf
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" class="form-control" required autofocus>
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" name="remember" id="remember">
                <label class="form-check-label" for="remember">Remember me</label>
            </div>
            <button class="btn btn-navy w-100" type="submit">Sign in</button>
        </form>
        <p class="mt-3 mb-0">Need an account? <a href="{{ route('register') }}">Register</a></p>
        <hr>
        <p class="small text-muted mb-0">Demo customer: customer@grandstay.test / password<br>Demo admin: admin@grandstay.test / password</p>
    </div>
</div>
@endsection
