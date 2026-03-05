<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskLists extends Model
{
    //
    protected $table = 'task_lists';
    protected $fillable = ['foreign_proponents_id', 'task', 'deadline','is_completed'];
}
