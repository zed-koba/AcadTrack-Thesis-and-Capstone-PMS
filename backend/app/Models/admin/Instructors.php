<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Instructors extends Model
{
    //
    protected $table = "instructors";
    protected $fillable = ['name', 'account_id', 'contact_number', 'department_id', 'status'];
    public function department(): BelongsTo
    {
        return $this->belongsTo(Departments::class, 'department_id');
    }

    public function students(): HasMany {
        return $this->hasMany(Students::class,'instructor_id');
    }

    public function account(): BelongsTo {
        return $this->belongsTo(Accounts::class,'account_id');
    }

    public function proponent(): HasMany
    {
        return $this->hasMany(Proponents::class, 'instructor_id');
    }
}
