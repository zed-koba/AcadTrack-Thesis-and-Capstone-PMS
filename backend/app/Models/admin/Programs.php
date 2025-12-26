<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;

class Programs extends Model
{
    //

    public function department() {
        return $this->belongsTo(Departments::class, 'department_id');
    }
}
