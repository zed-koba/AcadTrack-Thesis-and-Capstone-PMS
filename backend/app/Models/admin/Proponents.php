<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\admin\ProponentsDetails;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function details():HasMany {
        return $this->hasMany(ProponentsDetails::class, 'foreign_proponents_id', 'proponents_id');
    }

    protected static function booted()
    {
        static::creating(function ($model){
            $latestRecord = static::orderBy('id', 'DESC')->first();
            $nextNumber = $latestRecord ? ((int) str_replace('P-', '', $latestRecord->proponents_id) + 1) : 1;
            $model->proponents_id = 'P-' . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);
        });
    }


    
}
