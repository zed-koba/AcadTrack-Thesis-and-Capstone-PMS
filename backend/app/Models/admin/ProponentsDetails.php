<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProponentsDetails extends Model
{
    protected $primaryKey = 'propsdetails_id';
    protected $fillable = ['name', 'foreign_proponents_id'];
    
    public function proponent():BelongsTo {
        return $this->belongsTo(Proponents::class, 'foreign_proponents_id', 'proponents_id');
    }
}
