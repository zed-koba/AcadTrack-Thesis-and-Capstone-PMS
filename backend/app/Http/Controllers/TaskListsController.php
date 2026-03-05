<?php

namespace App\Http\Controllers;

use App\Models\admin\Proponents;
use App\Models\admin\ProponentsDetails;
use App\Models\admin\Students;
use App\Models\instructor\DocumentsDeadline;
use App\Models\TaskLists;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TaskListsController extends Controller
{
    //
    public function getTaskList($id)
    {
        if(!$id) {
            return response()->json(['message' => 'Cant find the id']);
        }
        $project_detail = ProponentsDetails::where('student_id', $id)->first();
        $project = Proponents::where('proponents_id', $project_detail->foreign_proponents_id)->with('adviser', 'details')->first();
        $student = Students::with('instructor', 'account')->findOrFail($id);
        $tasks = TaskLists::where('foreign_proponents_id', $project_detail->foreign_proponents_id)->get();
        $deadlines = DocumentsDeadline::where('instructor_id', $student->instructor_id)->with('instructor')->get();
        return response()->json([
            'message' => 'Sucessfully fetch tasks',
            'status' => 200,
            'tasks' => $tasks,
            'deadlines' => $deadlines,
            'project' => $project,
            'student' => $student,
        ], 200);
    }

    public function storeTask(Request $request)
    {
        $rules = [
            'proponents_id' => 'required|string',
            'task' => 'string|required',
            'deadline' => 'date|required',
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
            $task = TaskLists::create([
                'foreign_proponents_id' => $request->proponents_id,
                'task' => $request->task,
                'deadline' => $request->deadline,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Sucessfully stored the task',
                'status' => 201,

            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while storing the task.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateTask($id)
    {
        if(!$id) {
            return response()->json(['message' => 'Cant find the task']);
        }
        DB::beginTransaction();
        try {
            $task = TaskLists::findOrFail($id);
            $task->update([
                'is_completed' => $task->is_completed ? 0 : 1,  
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Successfully updated task',
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the task.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteTask($id) {
        if(!$id) {
            return response()->json(['message' => 'Cant find the task']);
        }
        DB::beginTransaction();
        try {
            $task = TaskLists::findOrFail($id);
            $task->delete();

            DB::commit();
            
        }catch(\Exception $e) {
            return response()->json([
                'message' => 'An error occured while deleting the task',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }
}
