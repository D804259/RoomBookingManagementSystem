<?php

namespace App\Policies;

use App\Models\User;

class RoomPolicy
{
    public function manage(User $user): bool
    {
        return $user->isAdmin();
    }
}
