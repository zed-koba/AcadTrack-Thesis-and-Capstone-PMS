<?php

namespace App\Http\Controllers;

use App\Models\admin\Proponents;
use App\Models\ArchivedDocuments;
use App\Models\instructor\DocumentsDeadline;
use App\Models\student\Documents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ArchivedDocumentsController extends Controller
{
    //
    public function getDocuments()
    {
        $archive = ArchivedDocuments::with(
            'project', 'project.groupLeader', 'project.details', 'project.details.student', 'project.adviser', 'project.groupLeader.program'
        )->orderBy('created_at', 'desc')->get();
        $documents = Documents::where('status', 'passed')->with(
            'student:id,student_id,name,program_id',
            'student.project', 'student.project.details.student', 'student.program', 'student.project.adviser'
        )->orderBy('created_at', 'desc')->get();
        $finalDeadlines = DocumentsDeadline::where('is_finalManuscript', '1')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 200,
            'archives' => $archive,
            'documents' => $documents,
            'deadlines' => $finalDeadlines,

        ], 200);
    }
    public function getInstructorDocuments($id)
    {
        $document = ArchivedDocuments::with(
            'project'
        )->orderBy('created_at', 'desc')->get();
        $projects = Proponents::with('adviser', 'details', 'details.student', 'groupLeader:id,name,instructor_id,program_id,section', 'groupLeader.instructor:id,name', 'groupLeader.program:id,name,code')->whereHas('groupLeader', function ($q) use ($id) {
            $q->where('instructor_id', $id);
        })->orderBy('created_at', 'asc')->get();
        return response()->json([
            'status' => 200,
            'document' => $document,
            'projects' => $projects,
        ], 200);
    }
    public function storeDocument(Request $request)
    {
        $rules = [
            'title_name' => 'required|string',
            'foreign_proponents_id' => 'required|string',
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
            
            $document = ArchivedDocuments::create(attributes: [
                'foreign_proponents_id' => $request->foreign_proponents_id,
                'title_name' => $request->title_name,
                'original_name' => $request->original_name,
                'stored_name' => $request->stored_name,
                'path' => $request->path,
                'mime_type' => $request->mime_type,
                'size' => $request->size,
                'version' => $request->version,
                'passed_date' => $request->passed_date,
                'archived_date' => now(),
            ]);


            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Archived succesfully',

            ], status: 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to archive',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function downloadDocument($id)
    {
        $document = ArchivedDocuments::findOrFail($id);
        $filePath = storage_path('app/public/' . $document->path);

        if (!file_exists($filePath)) {
            abort(404, "File not found");
        }

        return response()->download($filePath, $document->original_name);
    }
}
