<?php

namespace App\Models\admin;

use App\Models\admin\Accounts;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
