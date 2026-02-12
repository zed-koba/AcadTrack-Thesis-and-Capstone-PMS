<?php

namespace App\Models\admin;

use App\Models\admin\Advisers;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Accounts extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;
    //table name
    protected $table = 'accounts';

    protected $fillable = [
        'email',
        'password',
        'role',
        'student_id',
        'program',
        'section',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function adviser(): HasOne {
        return $this->hasOne(Advisers::class, 'account_id');
    }

    public function student(): hasOne {
        return $this->hasOne(Students::class,'account_id');
    }

    public function instructor(): hasOne {
        return $this->hasOne(Instructors::class,'account_id');
    }
}
