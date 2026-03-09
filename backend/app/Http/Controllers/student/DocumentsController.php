<?php

namespace App\Http\Controllers\student;

use App\Events\NotificationService;
use App\Http\Controllers\Controller;
use App\Models\admin\Proponents;
use App\Models\instructor\DocumentsDeadline;
use App\Models\student\Documents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class DocumentsController extends Controller
{
    public function getDocuments($id)
    {
        $document = Documents::with(
            'comments',
            'student:id,student_id,name'
        )->orderBy('created_at', 'desc')->get();
        $projects = Proponents::with('adviser', 'details', 'details.student', 'groupLeader:id,name,instructor_id,program_id,section', 'groupLeader.instructor:id,name', 'groupLeader.program:id,name,code')->orderBy('created_at', 'asc')->get();
        $deadline = DocumentsDeadline::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 200,
            'document' => $document,
            'projects' => $projects,
            'deadline' => $deadline,
        ], 200);
    }
    public function getInstructorDocuments($id)
    {
        $document = Documents::with(
            'comments',
            'student:id,student_id,name'
        )->orderBy('created_at', 'desc')->get();
        $projects = Proponents::with('adviser', 'details', 'details.student', 'groupLeader:id,name,instructor_id,program_id,section', 'groupLeader.instructor:id,name', 'groupLeader.program:id,name,code')->whereHas('groupLeader', function ($q) use ($id) {
            $q->where('instructor_id', $id);
        })->orderBy('created_at', 'asc')->get();
        $deadline = DocumentsDeadline::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 200,
            'document' => $document,
            'projects' => $projects,
            'deadline' => $deadline,
        ], 200);
    }
    public function getStudentDocuments($id)
    {
        $document = Documents::with(
            'comments',
            'student:id,student_id,name',
            'student.proponentDetail',
            'student.project',
        )->orderBy('created_at', 'desc')->get();
        $projects = Proponents::where("adviser_id", $id)->with('adviser', 'details', 'details.student', 'groupLeader:id,name,instructor_id,program_id,section', 'groupLeader.instructor:id,name', 'groupLeader.program:id,name,code')->orderBy('created_at', 'asc')->get();
        $deadline = DocumentsDeadline::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 200,
            'document' => $document,
            'projects' => $projects,
            'deadline' => $deadline,
        ], 200);
    }

    public function storeDocument(Request $request)
    {
        $rules = [
            'title_name' => 'required|string',
            'file' => 'required|file|mimes:pdf|max:10240',
            'parent_document_id' => 'nullable|string|exists:documents,id',

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

            $parentDocumentId = null;
            $version = 1;
            $status = "pending";
            $existDocument = Documents::where("title_name", "$request->title_name")->where("parent_document_id", null)->first();
            if ($existDocument) {
                $parentDocumentId = $existDocument->id;
                $latestVersion = Documents::where('parent_document_id', $parentDocumentId)
                    ->max('version');
                $version = ($latestVersion ?? 1) + 1;
            }
            if ($request->filled('parent_document_id')) {
                $parentDocumentId = $request->parent_document_id;
                $latestVersion = Documents::where('parent_document_id', $parentDocumentId)
                    ->max('version');
                $version = ($latestVersion ?? 1) + 1;
                $currentDoc = Documents::findOrFail($request->currentId)->update(['status' => 'revised']);
            }


            $document = Documents::create([
                'student_id' => $request->student_id,
                'title_name' => $request->title_name,
                'original_name' => $file->getClientOriginalName(),
                'stored_name' => basename($path),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'parent_document_id' => $parentDocumentId,
                'version' => $version,
                'status' => $status,
            ]);

            //event(NotificationService($document));
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
    public function passDocument($id)
    {
        $document = Documents::findOrFail($id);
        $document->update([
            'status' => 'passed',
            'passed_date' => now(),
        ]);
        return response()->json([
            'status' => 200,
            'message' => 'Document marked as passed',
        ], 200);
    }
}
