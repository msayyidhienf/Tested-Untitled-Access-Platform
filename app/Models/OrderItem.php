<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    /**
     * Tabel order_items tidak punya kolom created_at/updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'game_id',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
