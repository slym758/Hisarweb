<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use AuroraWebSoftware\AAuth\Contracts\AAuthUserContract;
use AuroraWebSoftware\AAuth\Traits\AAuthUser;
use AuroraWebSoftware\FiLogin\Contracts\FiLoginAuthenticatable;
use AuroraWebSoftware\FiLogin\Traits\HasFiLoginAuthentication;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements AAuthUserContract, FiLoginAuthenticatable
{
    /** @use HasFactory<UserFactory> */
    use AAuthUser, HasFactory, HasFiLoginAuthentication, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
