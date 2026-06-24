<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    /**
     * Tabel cart pakai added_at, bukan created_at/updated_at.
     */
    public $timestamps = false;

    protected $table = 'cart';

    protected $fillable = [
        'user_id',
        'game_id',
        'added_at',
    ];

    protected function casts(): array
    {
        return [
            'added_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
