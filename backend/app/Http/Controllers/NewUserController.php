<?php

namespace App\Http\Controllers;

use App\Models\admin\Accounts;
use App\Models\admin\Advisers;
use App\Models\admin\Departments;
use App\Models\admin\Instructors;
use App\Models\admin\Programs;
use App\Models\admin\Proponents;
use App\Models\admin\ProponentsDetails;
use App\Models\admin\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class NewUserController extends Controller
{
    //
    public function getDepartments()
    {
        $departments = Departments::where('status', 'active')->get();
        return response()->json([
            'status' => 200,
            'departments' => $departments,
        ], 200);
    }
    public function getData()
    {
        $instructor = Instructors::where('status', 'active')->get();
        $departments = Departments::where('status', 'active')->get();
        $advisers = Advisers::where('status', 'active')->get();
        $programs = Programs::where('status', 'active')->get();
        $projects = Proponents::with('details', 'adviser', 'details.student:id,name', 'groupLeader:id,name,instructor_id', 'groupLeader.instructor:id,name')->orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'instructors' => $instructor,
            'departments' => $departments,
            'advisers' => $advisers,
            'projects' => $projects,
            'programs' => $programs,
        ], 200);
    }

    public function updateStudent(Request $request, $id)
    {
        $rules = [
            'department_id' => 'required|integer',
            'program_id' => 'required|integer',
            'semester' => 'required|integer',
            'yearLevel' => 'required|integer',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $student = Students::findOrFail($id);
            $student->update([
                'department_id' => $request->department_id,
                'program_id' => $request->program_id,
                'semester' => $request->semester,
                'year_level' => $request->yearLevel,
            ]);
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Sucessfully updated student details',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while storing the task.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function joinProject(Request $request, $id)
    {
        if (!$request) {
            return response()->json(['message' => 'Cant find the thesis group']);
        }
        DB::beginTransaction();
        try {
            ProponentsDetails::create(attributes: [
                'foreign_proponents_id' => $request->foreign_proponents_id,
                'student_id' => $id,
            ]);
            $project = Proponents::findOrFail($request->project_id);
            $groupLeader = Students::findOrFail($project->student_id);
            $student = Students::findOrFail($id);
            $student->update([
                'instructor_id' => $groupLeader->instructor_id,
            ]);
            Accounts::findOrFail($student->account_id)->update([
                'new_user' => 0,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Successfully joined',
                'status' => 200,
                'project' => $project,
                'student' => $student,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the task.',
                'error' => $e->getMessage(),
                'request' => $request,
            ], 500);
        }
    }
    public function storeProject(Request $request, $id)
    {
        $rules = [
            'academic_yr' => 'required|string',
            'title' => 'required|string',
            'adviser_id' => 'required|integer',
            'instructor_id' => 'required|integer',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(
                [
                    'status' => 422,
                    'errors' => $validator->errors(),
                ],
                422,
            );
        }
        DB::beginTransaction();
        try {
            $proponents = Proponents::create([
                'academic_yr' => $request->academic_yr,
                'title' => $request->title,
                'adviser_id' => $request->adviser_id,
                'student_id' => $id,
            ]);
            $student = Students::findOrFail($id);
            $student->update([
                'instructor_id' => $request->instructor_id
            ]);

            Accounts::findOrFail($student->account_id)->update([
                'new_user' => 0,
            ]);


            DB::commit();
            return response()->json(
                [
                    'status' => 201,
                    'message' => 'Sucessfully added project',
                    'project' => $proponents,
                ],
                201,
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'error' => $e->getMessage(),
                ],
                500,
            );
        }
    }
}
