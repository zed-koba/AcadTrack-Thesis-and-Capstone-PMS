<?php

namespace App\Models\student;

use App\Models\admin\Proponents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevelopmentProcess extends Model
{
    //
    protected $table = "development_processes";
    protected $fillable = ['foreign_proponents_id', 'feature', 'start_date', 'end_date', 'status'];

    public function project(): BelongsTo {
        return $this->belongsTo(Proponents::class, 'foreign_proponents_id');
    }
}
