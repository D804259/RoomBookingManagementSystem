<?php

namespace App\Http\Requests;

use App\Enums\RoomStatus;
use App\Enums\RoomType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $roomId = $this->route('room')?->id;

        return [
            'room_number' => ['required', 'string', 'max:32', Rule::unique('rooms', 'room_number')->ignore($roomId)],
            'room_type' => ['required', Rule::in(RoomType::values())],
            'description' => ['required', 'string', 'max:2000'],
            'price_per_night' => ['required', 'numeric', 'min:1', 'decimal:0,2'],
            'capacity' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['required', Rule::enum(RoomStatus::class)],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
