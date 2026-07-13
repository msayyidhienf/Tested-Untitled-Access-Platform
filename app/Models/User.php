<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Tabel users lama tidak punya kolom updated_at.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'avatar',
        'banner',
        'bio',
        'country',
        'role',
        'ucash_balance',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'ucash_balance' => 'decimal:2',
        ];
    }

    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class)->orderByDesc('created_at');
    }

    public function library()
    {
        return $this->hasMany(Library::class);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function guides()
    {
        return $this->hasMany(Guide::class);
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function friendsOf()
    {
        return $this->hasMany(Friend::class, 'user_id');
    }

    public function friendedBy()
    {
        return $this->hasMany(Friend::class, 'friend_id');
    }

    public function achievements()
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            ->withPivot('unlocked_at');
    }
}
