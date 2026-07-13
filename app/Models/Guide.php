<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guide extends Model
{
    /**
     * Tabel guides tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'game_id',
        'title',
        'content',
        'views',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
