<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentAccounts extends Model
{
    use HasFactory;
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
}
