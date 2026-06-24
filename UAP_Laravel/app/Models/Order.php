<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /**
     * Tabel orders lama tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'total',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
