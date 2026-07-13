<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    /**
     * Tabel support_tickets tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'category',
        'message',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
