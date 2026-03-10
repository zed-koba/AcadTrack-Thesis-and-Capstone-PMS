<?php

namespace App\Models\instructor;

use App\Models\admin\Instructors;
use Illuminate\Database\Eloquent\Model;

class DocumentsDeadline extends Model
{
    //
    protected $table = 'documents_deadlines';
    protected $fillable = ['instructor_id', 'document_title', 'deadline', 'is_finalManuscript'];

    public function instructor() {
        return $this->belongsTo(Instructors::class, 'instructor_id');
    }
}
