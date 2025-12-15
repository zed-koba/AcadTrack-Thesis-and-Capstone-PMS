<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    use HasFactory;
    
    protected $table = 'students';
    protected $fillable = [
        'name',
        'student_id',
        'program',
        'section',
        'mobile_num',
        'semester',
        'facebook_profile',
        'year_level',
        'thesis_title',
        'role',
    ];
}
