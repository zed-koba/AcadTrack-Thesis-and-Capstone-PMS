<?php

namespace App\Models\adviser;

use App\Models\admin\Advisers;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdviserAvailability extends Model
{
    //
    protected $table = "adviser_availabilities";
    protected $fillable = ['adviser_id', 'start_time', 'end_time', 'day', 'is_available'];

    public function adviser(): BelongsTo {
        return $this->belongsTo(Advisers::class, 'adviser_id');
    }
}
