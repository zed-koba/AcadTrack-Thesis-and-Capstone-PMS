<?php

namespace App\Http\Controllers\adviser;

use App\Http\Controllers\Controller;
use App\Models\adviser\DocumentComments;
use App\Models\student\Documents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DocumentCommentsController extends Controller
{
    public function getComments($id)
    {
        $comment = DocumentComments::where("document_id", $id)->orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'comments' => $comment,
        ], 200);
    }

    public function storeComment(Request $request)
    {
        $rules = [
            'comment' => 'required|string',
            'comment_type' => 'required|in:general,need revision,approved',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $comment = DocumentComments::create([
                'document_id' => $request->document_id,
                'adviser_id' => 1,
                'comment' => $request->comment,
                'comment_type' => $request->comment_type,
            ]);
            $document = Documents::find($request->document_id);
            if (!$document) return response()->json(['message' => 'Document doesnt exist'], 404);
            if ($request->comment_type === 'general') {
                $document->update([
                    'status' => 'under review',
                ]);
                $message = 'general';
            } else if ($request->comment_type === 'need revision') {
                $document->update([
                    'status' => 'need revision',
                ]);
                $message = 'revision';
            } else {
                $document->update([
                    'status' => 'approved',
                    'approved_date' => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 201,
                'message' => 'Comment Added',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to insert comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
