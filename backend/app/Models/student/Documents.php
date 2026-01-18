<?php

namespace App\Models\student;

use App\Models\admin\Proponents;
use App\Models\admin\Students;
use App\Models\adviser\DocumentComments;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Documents extends Model
{
    protected $fillable = ['student_id', 'original_name', 'description', 'title_name', 'stored_name', 'status', 'path', 'mime_type', 'size', 'parent_document_id', 'version', 'chapter'];
    protected $table = "documents";

    public function student(): BelongsTo {
        return $this->belongsTo(Students::class, 'student_id');
    }

    public function comments(): HasMany {
        return $this->hasMany(DocumentComments::class,'document_id');
    }
}
