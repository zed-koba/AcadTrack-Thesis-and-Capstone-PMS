<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;

class Programs extends Model
{
    //
    protected $table = "programs";
    protected $fillable = ['name', 'code', 'department_id', 'description', 'status'];
    public function department() {
        return $this->belongsTo(Departments::class, 'department_id');
    }
}
