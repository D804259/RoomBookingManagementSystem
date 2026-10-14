<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customers_can_register_and_are_never_admins(): void
    {
        $response = $this->post('/register', [
            'name' => 'Dinesh Customer',
            'email' => 'dinesh@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'role' => 'admin',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticated();

        $user = User::query()->where('email', 'dinesh@example.com')->first();
        $this->assertNotNull($user);
        $this->assertSame(UserRole::Customer, $user->role);
        $this->assertTrue(password_verify('secret123', $user->getAuthPassword()));
    }

    public function test_users_can_log_in_and_log_out(): void
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
        ]);

        $this->post('/login', [
            'email' => 'login@example.com',
            'password' => 'password',
        ])->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($user);

        $this->post('/logout')->assertRedirect(route('home'));
        $this->assertGuest();
    }

    public function test_admin_login_redirects_to_admin_dashboard(): void
    {
        User::factory()->admin()->create([
            'email' => 'admin@example.com',
        ]);

        $this->post('/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ])->assertRedirect(route('admin.dashboard'));
    }
}
