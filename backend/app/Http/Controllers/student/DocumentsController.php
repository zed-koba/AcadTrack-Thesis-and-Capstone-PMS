<?php

namespace App\Http\Controllers\student;

use App\Http\Controllers\Controller;
use App\Models\student\Documents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class DocumentsController extends Controller
{
    public function getDocuments($id)
    {
        $document = Documents::where("student_id", $id)->with(
            'student:id,name,section,student_id,program_id,department_id,instructor_id,account_id,role_id',
            'student.program:id,name,code',
            'student.role:id,name',
            'student.department:id,name,code',
            'student.instructor:id,name',
            'student.account:id,email',
            'student.proponentDetail.proponent:id,proponents_id,title',
        )->get();

        return response()->json([
            'status' => 200,
            'document' => $document,
        ], 200);
    }

    public function storeDocument(Request $request)
    {
        $rules = [
            'title_name' => 'required|string',
            'file' => 'required|file|mimes:pdf|max:10240',
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
            $file = $request->file('file');
            $path = $file->store('documents', 'public');

            $document = Documents::create([
                'student_id' => 1,
                'title_name' => $request->title_name,
                'description' => $request->description,
                'original_name' => $file->getClientOriginalName(),
                'stored_name' => basename($path),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);
            DB::commit();

            return response()->json([
                'status' => 201,
                'message' => 'Document uploaded succesfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to insert document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function downloadDocument($id)
    {
        $document = Documents::findOrFail($id);
        $filePath = storage_path('app/public/' . $document->path);

        if (!file_exists($filePath)) {
            abort(404, "File not found");
        }

        return response()->download($filePath, $document->original_name);
    }
}
