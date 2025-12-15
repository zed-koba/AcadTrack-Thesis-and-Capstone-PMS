<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class StudentsController extends Controller
{
    public function getData()
    {
        $students = Students::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' => 200,
            'data' => $students,
        ]);
    }

    public function storeStudent(Request $request)
    {
        $rules = [
            'name' => 'required',
            'student_id' => 'required|unique:students,student_id',
            'program' => 'required',
            'section' => 'required',
            'mobile_num' => 'nullable|regex:/^([0-9\s\-\+\(\)]*)$/|max:11',
            'semester' => 'required',
            'facebook_profile' => 'nullable',
            'year_level' => 'required',
            'thesis_title' => 'nullable',
            'role' => 'in:not assigned,programmer,database,user interface,system analyst|required',

        ];
        $messages = [
            'student_id.unique' => 'Student ID already exists',
            'role.in' => 'Selected role is invalid',
            'mobile_num.regex' => 'Mobile number format is invalid',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json(
                [
                    'status' => 422,
                    'errors' => $validator->errors(),
                ],
                422,
            );
        }
        try {
            DB::beginTransaction();
            $student = new Students();
            $student->name = $request->name;
            $student->student_id = $request->student_id;
            $student->program = $request->program;
            $student->section = $request->section;
            $student->mobile_num = $request->mobile_num;
            $student->semester = $request->semester;
            $student->facebook_profile = $request->facebook_profile;
            $student->year_level = $request->year_level;
            $student->thesis_title = $request->thesis_title;
            $student->role = $request->role;
            $student->save();
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully added student',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while registering the account.',
            ], 500);
        }
    }

    public function updateStudent($id, Request $request)
    {
        $rules = [
            'name' => 'required',
            'student_id' => 'required|unique:students,student_id,' . $id,
            'program' => 'required',
            'section' => 'required',
            'mobile_num' => 'nullable|regex:/^([0-9\s\-\+\(\)]*)$/|max:11',
            'semester' => 'required',
            'facebook_profile' => 'nullable',
            'year_level' => 'required',
            'thesis_title' => 'nullable',
            'role' => 'in:not assigned,programmer,database,user interface,system analyst|required',

        ];
        $messages = [
            'student_id.unique' => 'Student ID already exists',
            'role.in' => 'Selected role is invalid',
            'mobile_num.regex' => 'Mobile number format is invalid',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json(
                [
                    'status' => 422,
                    'errors' => $validator->errors(),
                ],
                422,
            );
        }
        try {
            DB::beginTransaction();
            $student = Students::find($id);
            $student->update($request->only(['name', 'student_id', 'program', 'section', 'mobile_num', 'semester', 'facebook_profile', 'year_level', 'thesis_title', 'role']));

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully updated student',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the student.',
            ], 500);
        }
    }

    public function deleteStudent($id)
    {
        DB::beginTransaction();
        try {
            $student = Students::find($id);
            $student->delete();
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully deleted student',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while deleting the student.',
            ], 500);
        }
    }
}
