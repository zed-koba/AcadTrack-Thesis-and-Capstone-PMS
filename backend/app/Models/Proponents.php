<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Proponents extends Model
{
    //
    protected $table = 'proponents';
    protected $fillable = [
        'academic_yr', 
        'semester', 
        'title', 
        'adviser', 
        'program'];

    protected static function booted()
    {
        static::creating(function ($model){
            $latestRecord = static::orderBy('id', 'DESC')->first();
            $nextNumber = $latestRecord ? ((int) str_replace('P-', '', $latestRecord->proponents_id) + 1) : 1;
            $model->proponents_id = 'P-' . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);
        });
    }
    
}
