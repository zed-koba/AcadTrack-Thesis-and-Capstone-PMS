<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = "roles";

    protected $fillable = ['name', 'description', 'globalRole', 'department_id', 'status'];

    public function department() {
        return $this->belongsTo(Departments::class, 'department_id');
    }
}
