@extends('layouts.admin')

@section('title', 'Customers')

@section('content')
<h1 class="h3 mb-4">Customers</h1>
<form method="GET" class="panel-card p-3 mb-3">
    <div class="input-group">
        <input type="search" name="q" value="{{ request('q') }}" class="form-control" placeholder="Search name or email">
        <button class="btn btn-navy" type="submit">Search</button>
    </div>
</form>
<div class="panel-card p-3">
    <div class="table-responsive">
        <table class="table align-middle mb-0">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Bookings</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($customers as $customer)
                    <tr>
                        <td>{{ $customer->name }}</td>
                        <td>{{ $customer->email }}</td>
                        <td>{{ $customer->bookings_count }}</td>
                        <td><a href="{{ route('admin.customers.show', $customer) }}">View</a></td>
                    </tr>
                @empty
                    <tr><td colspan="4" class="text-muted">No customers found.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
<div class="mt-3">{{ $customers->links() }}</div>
@endsection
