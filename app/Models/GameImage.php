<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameImage extends Model
{
    /**
     * Tabel game_images lama tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'game_id',
        'filename',
        'sort_order',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
