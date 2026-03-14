<?php

namespace App\Models;

use App\Http\Controllers\admin\ProponentsController;
use App\Models\admin\Proponents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchivedDocuments extends Model
{
    //
    protected $table = "archived_documents";
    protected $fillable = ['foreign_proponents_id', 'original_name', 'title_name', 'stored_name', 'path', 'mime_type', 'size', 'version', 'archived_date', 'passed_date'];
    
    public function project(): BelongsTo {
        return $this->belongsTo(Proponents::class, 'foreign_proponents_id', 'proponents_id');
    }
}
