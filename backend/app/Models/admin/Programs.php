<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Programs extends Model
{
    //
    protected $table = "programs";
    protected $fillable = ['name', 'code', 'department_id', 'description', 'status'];
    public function department():BelongsTo {
        return $this->belongsTo(Departments::class, 'department_id');
    }
}
