<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Library extends Model
{
    /**
     * Tabel library pakai purchased_at, bukan created_at/updated_at.
     */
    public $timestamps = false;

    protected $table = 'library';

    protected $fillable = [
        'user_id',
        'game_id',
        'hours_played',
        'is_installed',
        'is_favorite',
        'purchased_at',
    ];

    protected function casts(): array
    {
        return [
            'is_installed' => 'boolean',
            'is_favorite' => 'boolean',
            'purchased_at' => 'datetime',
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
