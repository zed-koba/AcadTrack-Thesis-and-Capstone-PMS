<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\admin\Role;
use App\Models\admin\Advisers;
use App\Models\admin\Programs;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departments extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentsFactory> */
    use HasFactory;
    protected $table = 'departments';
    protected $fillable = ['name', 'code', 'description', 'status', 'department_id'];
    public function roles():HasMany {
        return $this->hasMany(Role::class, 'department_id');
    }

    public function advisers():HasMany {
        return $this->hasMany(Advisers::class, 'department_id');
    }

    public function programs():HasMany {
        return $this->hasMany(Programs::class, 'department_id');
    }

    public function students():HasMany {
        return $this->hasMany(Students::class,'department_id');
    }

    public function instructors():HasMany {
        return $this->hasMany(Instructors::class,'department_id');
    }

 
    
}
