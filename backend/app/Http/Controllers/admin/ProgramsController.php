<?php

namespace App\Http\Controllers\admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\admin\Departments;
use App\Models\admin\Programs;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProgramsController extends Controller
{
    public function getPrograms()
    {
        $programs = Programs::orderBy("created_at", "desc")->get();
        $departments = Departments::where('status', 'active')->orderBy('created_at', 'desc')->get();
        return response()->json([
            "status" => 200,
            "message" => "Successfully fetch programs data",
            "programs" => $programs,
            "departments" => $departments,
        ]);
    }

    public function storeProgram(Request $request)
    {
        $rules = [
            'name' => 'required|string',
            'description' => 'nullable|string',
            'code' => 'required|string|max:10|min:2',
            'department_id' => 'nullable|integer',
            'status' => 'in:active,inactive|required'
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
            $program = Programs::create([
                'name' => $request->name,
                'description' => $request->description,
                'code' => $request->code,
                'students_count' => 0,
                'department_id' => $request->department_id,
                'status' => $request->status
            ]);
            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Program added successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to insert role',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateProgram(Request $request, $id)
    {
        $rules = [
            'name' => 'required|string',
            'description' => 'nullable|string',
            'code' => 'required|string|max:10|min:2',
            'department_id' => 'nullable|integer',
            'status' => 'in:active,inactive|required'
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
            $program = Programs::find($id);
            $program->update($request->only(['name','description','code', 'department_id', 'status']));
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Program updated successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to updated role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
