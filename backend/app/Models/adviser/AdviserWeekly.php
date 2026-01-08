<?php

namespace App\Models\adviser;

use App\Models\admin\Advisers;
use App\Models\admin\Students;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdviserWeekly extends Model
{
    protected $table = "adviser_weeklies";
    protected $fillable = ['adviser_id', 'student_id', 'date', 'day_of_week', 'start_time', 'end_time', 'purpose', 'feedback', 'status'];

    public function adviser(): BelongsTo {
        return $this->belongsTo(Advisers::class, 'adviser_id');
    }
    public function student(): BelongsTo {
        return $this->belongsTo(Students::class, 'student_id');
    }
}
