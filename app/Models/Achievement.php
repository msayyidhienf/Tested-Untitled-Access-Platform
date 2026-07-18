<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    /**
     * Tabel achievements tidak punya kolom created_at/updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'rarity',
        'type',
        'threshold',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot('unlocked_at');
    }
}
