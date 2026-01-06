<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Instructors extends Model
{
    //
    protected $table = "instructors";
    protected $fillable = ['name', 'contact_number', 'department_id', 'status'];
    public function department(): BelongsTo
    {
        return $this->belongsTo(Departments::class, 'department_id');
    }
}
