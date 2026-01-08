<?php

namespace App\Models\admin;

use App\Models\admin\Accounts;
use App\Models\adviser\AdviserAvailability;
use App\Models\adviser\AdviserWeekly;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Advisers extends Model
{
    //
    protected $table = "advisers";
    protected $fillable = ['name', 'account_id', 'contact_number', 'department_id', 'status'];
    public function department():BelongsTo {
        return $this->belongsTo(Departments::class, 'department_id');
    }

    public function account():BelongsTo {
        return $this->belongsTo(Accounts::class, 'account_id');
    }

    public function projects():HasMany {
        return $this->hasMany(Proponents::class, 'adviser_id');
    }

    public function adviserAvailability():hasMany {
        return $this->hasMany(AdviserAvailability::class, 'adviser_id');
    }

    public function weeklySchedule(): hasMany {
        return $this->hasMany(AdviserWeekly::class,'adviser_id');
    }
}
