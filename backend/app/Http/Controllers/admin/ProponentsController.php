<?php

namespace App\Http\Controllers\admin;

use Illuminate\Http\Request;
use App\Models\admin\Proponents;
use App\Models\admin\ProponentsDetails;
use App\Http\Controllers\Controller;
use App\Models\admin\Advisers;
use App\Models\admin\Programs;
use App\Models\admin\Role;
use App\Models\admin\Students;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProponentsController extends Controller
{
  //
  public function getProponents()
  {
    $proponents = Proponents::with('details')->orderBy('created_at', 'DESC')->get();
    $advisers = Advisers::where('status', 'active')->get();
    $programs = Programs::where('status', 'active')->get();
    $students = Students::orderBy('created_at', 'DESC')->get();
    $roles = Role::where('status','active')->get();
    return response()->json([
      'status' => 200,
      'proponents' => $proponents,
      'programs' => $programs,
      'advisers' => $advisers,
      'students' => $students,
      'roles' => $roles,
    ], 200);
  }

  public function storeProponent(Request $request)
  {
    $rules = [
      'academic_yr' => 'required|string',
      'title' => 'required|string',
      'adviser_id' => 'required|integer',
      'students_id' => 'array|nullable',
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
        'student_id' => $request->student_id,
      ]);
      if (isset($request->students_id)) {
        foreach ($request->students_id as $student) {
          if($student === $proponents->student_id) return;
          ProponentsDetails::create(attributes: [
            'foreign_proponents_id' => $proponents->proponents_id,
            'student_id' => $student,
          ]);
        }
      }

      DB::commit();
      return response()->json(
        [
          'status' => 201,
          'message' => 'Sucessfully added project',
          'data' => [
            'proponent' => $proponents,
            'students_id' => $request->students_id,
          ],
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

  public function updateProponent($id, Request $request)
  {
    $rules = [
      'academic_yr' => 'required|string',
      'title' => 'required|string',
      'adviser_id' => 'required|integer',
      'students_id' => 'array|nullable',
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
      $proponents = Proponents::find($id);
      $proponents->update($request->only(['academic_yr', 'title', 'adviser_id']));
      foreach ($request->students_id as $detail) {
        $detailModel = ProponentsDetails::where('foreign_proponents_id', $proponents->proponents_id)->where('student_id', $detail);
        if (!$detailModel->exists()) {
          ProponentsDetails::create([
            'foreign_proponents_id' => $proponents->proponents_id,
            'student_id' => $detail,
          ]);
          $message = "student doesnt exist";
        }
      }

      if (!empty($request->deleted_ids)) {
        ProponentsDetails::where('foreign_proponents_id', $proponents->proponents_id)->whereIn('student_id', $request->deleted_ids)->delete();
      }

      DB::commit();
      return response()->json([
        'status' => 200,
        'message' => 'Sucessfully updated the proponent',
        'data' => [
          'proponent' => $proponents->proponents_id,
        ]
      ], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'error' => $e->getMessage(),
      ], 500);
    }
  }

  public function deleteProponent($id)
  {
    DB::beginTransaction();
    try {
      $proponents = Proponents::find($id);
      if (!$proponents) {
        return response()->json(['message' => "Not Found"], 404);
      }
      $proponents->delete();
      $error = $proponents;
      DB::commit();
      return response()->json([
        'status' => 200,
        'message' => "Deleted Successfully",
        'Error' => $error,
      ], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'error' => $e->getMessage(),
      ], 500);
    }
  }
}
