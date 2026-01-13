<?php

namespace App\Models\adviser;

use App\Models\student\Documents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentComments extends Model
{
    protected $table = "document_comments";
    protected $fillable = ['document_id', 'adviser_id', 'comment', 'comment_type'];

    public function document(): BelongsTo {
        return $this->belongsTo(Documents::class, 'document_id');
    }
}
