<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $this->upsertUser(
            'admin@grandstay.test',
            'Hotel Administrator',
            UserRole::Admin
        );

        $this->upsertUser(
            'customer@grandstay.test',
            'Demo Customer',
            UserRole::Customer
        );
    }

    private function upsertUser(string $email, string $name, UserRole $role): void
    {
        $user = User::query()->firstOrNew(['email' => $email]);
        $user->name = $name;
        $user->password = Hash::make('password');
        $user->role = $role;
        $user->save();
    }
}
