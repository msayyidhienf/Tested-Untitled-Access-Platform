<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * Tabel posts tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'category',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(PostReply::class);
    }
}
