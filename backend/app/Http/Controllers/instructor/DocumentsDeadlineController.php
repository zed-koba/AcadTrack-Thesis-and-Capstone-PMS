<?php

namespace App\Http\Controllers\instructor;

use App\Http\Controllers\Controller;
use App\Models\admin\Proponents;
use App\Models\instructor\DocumentsDeadline;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DocumentsDeadlineController extends Controller
{
    //
    public function getDeadlines($id)
    {
        $deadlines = DocumentsDeadline::where('instructor_id', $id)->with("instructor:id,name")->orderBy('created_at', 'desc')->get();
        $projects = Proponents::with([         
            'groupLeader' => function ($query) {
                $query->select('id', 'student_id', 'instructor_id', 'section', 'program_id', 'name')
                    ->with('program:id,name,code')
                    ->with('document'); 
            },
            'adviser.department:id,name,code', 'details', 'details.student', 'details.student.document'
        ])
            ->whereHas('groupLeader', function ($query) use ($id) {
                $query->where('instructor_id', $id);
            })
            ->orderBy('created_at', 'asc')
            ->get();
        return response()->json([
            'status' => 200,
            'message' => 'Successfully fetched deadlines',
            'deadlines' => $deadlines,
            'projects' => $projects,
        ], 200);
    }

    public function addDeadlines(Request $request)
    {
        $rules = [
            'document_title' => 'required',
            'deadline' => 'required|date',
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
            DocumentsDeadline::create([
                'instructor_id' => $request->instructor_id,
                'document_title' => $request->document_title,
                'deadline' => $request->deadline,
            ]);

            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Successfully added deadline',
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while adding the deadline',
            ], 500);
        }
    }

    public function updateDeadline(Request $request, $id)
    {
        $rules = [
            'document_title' => 'required',
            'deadline' => 'required|date',
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
            $deadline = DocumentsDeadline::findOrFail($id);
            $deadline->update([
                'document_title' => $request->document_title,
                'deadline' => $request->deadline,
            ]);

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully updated deadline',
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the deadline',
            ], 500);
        }
    }
    public function deleteDeadline($id)
    {
        DB::beginTransaction();
        try {
            $deadline = DocumentsDeadline::findOrFail($id);
            $deadline->delete();

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully deleted deadline',
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the deadline',
            ], 500);
        }
    }
}
