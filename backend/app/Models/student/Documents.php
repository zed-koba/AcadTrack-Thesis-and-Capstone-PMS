<?php

namespace App\Models\student;

use App\Models\admin\Proponents;
use App\Models\admin\Students;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documents extends Model
{
    protected $fillable = ['student_id', 'original_name', 'description', 'title_name', 'stored_name', 'path', 'mime_type', 'size'];
    protected $table = "documents";

    public function student(): BelongsTo {
        return $this->belongsTo(Students::class, 'student_id');
    }

    public function project(): BelongsTo {
        return $this->belongsTo(Proponents::class, 'proponent_id');
    }
}
