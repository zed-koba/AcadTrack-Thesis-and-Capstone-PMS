<?php

namespace App\Http\Controllers;

use App\Models\admin\Accounts;
use App\Models\admin\Departments;
use App\Models\admin\Instructors;
use App\Models\admin\Programs;
use App\Models\admin\Proponents;
use App\Models\admin\Role;
use App\Models\admin\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class StudentsController extends Controller
{
    public function getData()
    {
        $students = Students::orderBy('created_at', 'DESC')->get();
        $departments = Departments::where('status', 'active')->orderBy('created_at', 'DESC')->get();
        $roles = Role::where('status', 'active')->get();
        $programs = Programs::where('status', 'active')->get();
        $instructors = Instructors::where('status', 'active')->get();
        $proponents = Proponents::with('details')->get();
        return response()->json([
            'status' => 200,
            'students' => $students,
            'departments' => $departments,
            'roles' => $roles,
            'programs' => $programs,
            'instructors' => $instructors,
            'proponents' => $proponents,
        ], 200);
    }

    public function storeStudent(Request $request)
    {
        $rules = [
            'name' => 'required',
            'student_id' => 'required|unique:students,student_id',
            'email' => 'required|string',
            'department_id' => 'nullable|integer',
            'program_id' => 'nullable|integer',
            'section' => 'required',
            'mobile_num' => 'nullable|regex:/^([0-9\s\-\+\(\)]*)$/|max:11',
            'semester' => 'required',
            'facebook_profile' => 'nullable',
            'year_level' => 'required',
            'role_id' => 'integer|nullable',

        ];
        $messages = [
            'student_id.unique' => 'Student ID already exists',
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
            $account = Accounts::create([
                'email' => $request->email,
                'password' => '123',
                'status' => 'pending',
                'role' => 'student',
            ]);

            $student = Students::create([
                'name' => $request->name,
                'student_id' => $request->student_id,
                'department_id' => $request->department_id,
                'program_id' => $request->program_id,
                'section' => $request->section,
                'account_id' => $account->id,
                'mobile_num' => $request->mobile_num,
                'semester' => $request->semester,
                'facebook_profile' => $request->facebook_profile,
                "year_level" => $request->year_level,
                "thesis_title" => $request->thesis_title,
                "role_id" => $request->role_id,
            ]);

            if ($request->role_id != null) {
                $role = Role::find($request->role_id);
                $role->increment('assigned');
            }
            if($request->program_id != null) {
                $program = Programs::find($request->program_id);
                $program->increment('students_count');
            }
            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Successfully added student',

            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while registering the account.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateStudent($id, Request $request)
    {
        $rules = [
            'name' => 'required',
            'student_id' => 'required|unique:students,student_id,' . $id,
            'department_id' => 'nullable|integer',
            'program_id' => 'nullable|integer',
            'section' => 'required',
            'mobile_num' => 'nullable|regex:/^([0-9\s\-\+\(\)]*)$/|max:11',
            'semester' => 'required',
            'facebook_profile' => 'nullable',
            'year_level' => 'required',
            'thesis_title' => 'nullable',
            'role_id' => 'integer|nullable',

        ];
        $messages = [
            'student_id.unique' => 'Student ID already exists',
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
            if ($student->role_id != $request->role_id) {
                $initialRole = Role::find($student->role_id);
                $newRole = Role::find($request->role_id);
                if ($request->role_id != null) {
                    $newRole->increment('assigned');
                }
                if ($student->role_id != null) {
                    $initialRole->decrement('assigned');
                }
            }
            $student->update($request->only(['name', 'student_id', 'department_id', 'program_id', 'section', 'mobile_num', 'semester', 'facebook_profile', 'year_level', 'thesis_title', 'role_id']));
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
                'error' => $e->getMessage(),
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
