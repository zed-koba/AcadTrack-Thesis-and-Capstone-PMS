<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Programs extends Model
{
    //
    protected $table = "programs";
    protected $fillable = ['name', 'code', 'department_id', 'description', 'status'];
    public function department():BelongsTo {
        return $this->belongsTo(Departments::class, 'department_id');
    }

    public function students():HasMany {
        return $this->hasMany(Students::class,'program_id');
    }

}
