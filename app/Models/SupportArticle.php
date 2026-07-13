<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportArticle extends Model
{
    /**
     * Tabel support_articles tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'category',
        'title',
        'content',
        'views',
    ];
}
