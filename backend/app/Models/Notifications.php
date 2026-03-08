<?php

namespace App\Models;

use App\Models\admin\Advisers;
use App\Models\admin\Proponents;
use App\Models\admin\Students;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifications extends Model
{
    //
    protected $fillable = ['instructor_id', 'foreign_proponents_id', 'adviser_id', 'type', 'message', 'read_at', 'title'];

    protected $table = "notifications";

    public function  project(): BelongsTo {
        return $this->belongsTo(Proponents::class, 'foreign_proponents_id', 'proponents_id');
    }

    public function instructor(): BelongsTo {
        return $this->belongsTo(Students::class, 'instructor_id');
    }

    public function adviser(): BelongsTo {
        return $this->belongsTo(Advisers::class, 'adviser_id');
    }
}
