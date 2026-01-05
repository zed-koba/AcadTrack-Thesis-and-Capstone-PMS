<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Role extends Model
{
    protected $table = "roles";

    protected $fillable = ['name', 'description', 'globalRole', 'department_id', 'status'];

    public function department():BelongsTo {
        return $this->belongsTo(Departments::class, 'department_id');
    }
}
