<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\admin\Departments;
use App\Models\admin\Instructors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InstructorsController extends Controller
{
    //
    public function getInstructors(Request $request)
    {
        $instructor = Instructors::orderBy('created_at', 'DESC')->get();
        $departments = Departments::where('status', 'active')->orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' => 200,
            'instructor' => $instructor,
            'departments' => $departments,
        ], 200);
    }

    public function storeInstructor(Request $request)
    {
        $rules = [
            'name' => 'required|string',
            'contact_number' => 'nullable|regex:/^([0-9\s\-\+\(\)]*)$/|max:11',
            'status' => 'in:active,inactive|required',
        ];
        $messages = [
            'mobile_num.regex' => 'Mobile number format is invalid',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $instructor = Instructors::create([
                'name' => $request->name,
                'contact_number' => $request->contact_number,
                'department_id' => $request->department_id,
                'status' => $request->status,
            ]);
            
            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Instructor added sucessfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to insert adviser',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateInstructor(Request $request, $id)
    {
        $instructor = Instructors::find($id);
        $rules = [
            'name' => 'required|string',
            'contact_number' => 'nullable|regex:/^([0-9\s\-\+\(\)]*)$/|max:11',
            'status' => 'in:active,inactive|required',
        ];
        $messages = [
            'mobile_num.regex' => 'Mobile number format is invalid',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $instructor->update($request->only(['name', 'contact_num', 'department_id', 'status']));
            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Instructor updated sucessfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update Instructor',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteInstructor($id)
    {
        DB::beginTransaction();
        try {
            $adviser = Instructors::find($id);
            $adviser->delete();
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully deleted instructor',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while deleting the instructor.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
