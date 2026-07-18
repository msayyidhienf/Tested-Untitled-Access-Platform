<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    /**
     * Tabel collections tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function libraryEntries()
    {
        return $this->belongsToMany(Library::class, 'collection_library', 'collection_id', 'library_id');
    }
}
