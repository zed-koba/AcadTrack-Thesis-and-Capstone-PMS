<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Role extends Model
{
    protected $table = "roles";

    protected $fillable = ['name', 'description', 'globalRole', 'department_id', 'status'];

    public function department():BelongsTo {
        return $this->belongsTo(Departments::class, 'department_id');
    }

    public function student():HasOne {
        return $this->hasOne(Students::class, 'role_id');
    }
}
