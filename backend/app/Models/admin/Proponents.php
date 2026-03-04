<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Notifications;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proponents extends Model
{
    //
    protected $table = 'proponents';
    protected $fillable = [
        'academic_yr',
        'title',
        'adviser_id',
    ];

    public function student(): HasMany
    {
        return $this->hasMany(Students::class, 'foreign_proponents_id', 'proponents_id');
    }
    public function notifications(): HasMany
    {
        return $this->hasMany(Notifications::class, 'foreign_proponents_id', 'proponents_id');
    }

    public function adviser(): BelongsTo
    {
        return $this->belongsTo(Advisers::class, 'adviser_id');
    }
    protected static function booted()
    {
        static::creating(function ($model) {
            $latestRecord = static::orderBy('id', 'DESC')->first();
            $nextNumber = $latestRecord ? ((int) str_replace('P-', '', $latestRecord->proponents_id) + 1) : 1;
            $model->proponents_id = 'P-' . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);
        });
    }
}
