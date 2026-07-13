<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostReply extends Model
{
    /**
     * Tabel post_replies tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'post_id',
        'user_id',
        'content',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
