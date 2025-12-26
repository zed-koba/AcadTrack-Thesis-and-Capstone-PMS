<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;

class Advisers extends Model
{
    //

    public function department() {
        return $this->belongsTo(Departments::class, 'department_id');
    }
}
