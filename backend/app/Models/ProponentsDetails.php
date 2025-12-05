<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\HasFactory;

class ProponentsDetails extends Model
{
    protected $primaryKey = 'propsdetails_id';
    protected $fillable = ['name', 'foreign_proponents_id'];
    
    public function proponent() {
        return $this->belongsTo(Proponents::class, 'foreign_proponents_id', 'proponents_id');
    }

}
