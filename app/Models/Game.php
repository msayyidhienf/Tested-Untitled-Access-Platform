<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    /**
     * Tabel games lama tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'title',
        'description',
        'genre',
        'price',
        'discount',
        'image',
        'is_hero',
        'hero_order',
        'is_free',
        'release_date',
        'developer',
        'publisher',
        'req_os',
        'req_processor',
        'req_memory',
        'req_graphics',
        'req_storage',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_hero' => 'boolean',
            'is_free' => 'boolean',
            'release_date' => 'date',
        ];
    }

    public function images()
    {
        return $this->hasMany(GameImage::class)->orderBy('sort_order');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function guides()
    {
        return $this->hasMany(Guide::class);
    }
}
