<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProponentsDetails extends Model
{
    protected $primaryKey = 'propsdetails_id';
    protected $fillable = ['foreign_proponents_id', 'student_id'];
    
    public function proponent():BelongsTo {
        return $this->belongsTo(Proponents::class, 'foreign_proponents_id', 'proponents_id');
    }

    public function student(): BelongsTo {
        return $this->belongsTo(Students::class, 'student_id');
    }
}
