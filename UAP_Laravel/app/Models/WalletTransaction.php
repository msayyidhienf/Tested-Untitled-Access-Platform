<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    /**
     * Tabel wallet_transactions tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'balance_after',
        'description',
        'order_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
            'created_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
