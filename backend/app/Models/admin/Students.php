<?php

namespace App\Models\admin;

use App\Models\adviser\AdviserWeekly;
use App\Models\Notifications;
use App\Models\student\Documents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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

    public function department(): BelongsTo
    {
        return $this->belongsTo(Departments::class, 'department_id');
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id');
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructors::class, 'instructor_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Accounts::class, 'account_id');
    }

    public function weeklySchedule(): HasMany
    {
        return $this->hasMany(AdviserWeekly::class, 'student_id');
    }

    public function document(): HasMany
    {
        return $this->hasMany(Documents::class, 'student_id');
    }
    public function notification(): HasMany
    {
        return $this->hasMany(Notifications::class, 'student_id');
    }
    public function proponent(): BelongsTo
    {
        return $this->belongsTo(Proponents::class, 'foreign_proponents_id', 'proponents_id');
    }
}
