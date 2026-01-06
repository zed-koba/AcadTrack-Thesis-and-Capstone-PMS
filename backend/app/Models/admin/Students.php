<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Students extends Model
{
    use HasFactory;
    
    protected $table = 'students';
    protected $fillable = [
        'name',
        'student_id',
        'department_id',
        'program_id',
        'account_id',
        'section',
        'mobile_num',
        'semester',
        'facebook_profile',
        'year_level',
        'instructor_id',
        'role_id',
    ];

    public function department():BelongsTo {
        return $this->belongsTo(Departments::class, 'department_id');
    }

    public function programs():BelongsTo {
        return $this->belongsTo(Programs::class,'program_id');
    }

    public function roles():BelongsTo {
        return $this->belongsTo(Role::class,'role_id');
    }

    public function proponent():HasOne {
        return $this->hasOne(ProponentsDetails::class, 'student_id');
    }

    public function instructor():HasOne {
        return $this->hasOne(Instructors::class, 'instructor_id');
    }

    public function account(): BelongsTo {
        return $this->belongsTo(Accounts::class, 'account_id');
    }
}
