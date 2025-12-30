<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\admin\Role;
use App\Models\admin\Advisers;
use App\Models\admin\Programs;

class Departments extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentsFactory> */
    use HasFactory;
    protected $table = 'departments';
    protected $fillable = ['name', 'code', 'description', 'status', 'department_id'];
    public function roles() {
        return $this->hasMany(Role::class, 'department_id');
    }

    public function advisers() {
        return $this->hasMany(Advisers::class, 'department_id');
    }

    public function programs() {
        return $this->hasMany(Programs::class, 'department_id');
    }
}
