<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopupOrder extends Model
{
    protected $fillable = [
        'user_id',
        'midtrans_order_id',
        'amount',
        'status',
        'snap_token',
        'payment_type',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
