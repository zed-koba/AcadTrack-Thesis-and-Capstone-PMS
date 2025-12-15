<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudentAccounts;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class StudentAccountController extends Controller
{
  //
  public function getData()
  {
    $accounts = StudentAccounts::orderBy('created_at', 'DESC')->get();
    return response()->json([
      'status' => 200,
      'data' => $accounts,
    ]);
  }

  public function storeAccount(Request $request)
  {
    $rules = [
      'email' => 'required|email|unique:accounts,email',
      'student_id' => 'required|unique:accounts,student_id',
      'program' => 'required',
      'section' => 'required',
    ];
    $messages = [
      'student_id.unique' => 'Student ID already exists',
      'email.unique' => 'Email already exists',
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
      $account = new StudentAccounts();
      $account->email = $request->email;
      $account->password = Hash::make('password');
      $account->student_id = $request->student_id;
      $account->role = 'student';
      $account->program = $request->program;
      $account->section = $request->section;
      $account->save();
      DB::commit();
      return response()->json([
        'status' => 200,
        'message' => 'Successfully registered',
      ]);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'status' => 500,
        'message' => 'An error occurred while registering the account.',
      ], 500);
    }

  }

  public function updateAccount($id, Request $request)
  {
    $rules = [
      'email' => 'required|email|unique:accounts,email',
      'student_id' => 'required|unique:accounts,student_id',
      'program' => 'required',
      'section' => 'required',
    ];
    $messages = [
      'student_id.unique' => 'Student ID already exists',
      'email.unique' => 'Email already exists',
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
      $account = StudentAccounts::find($id);
      $account->update($request->only(['email', 'student_id', 'program', 'section']));

      DB::commit();
      return response()->json([
        'status' => 200,
        'message' => 'Successfully updated account',
      ], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'status' => 500,
        'message' => 'An error occurred while updating the account.',
      ], 500);
    }

  }

  public function deleteAccount($id)
  {
    DB::beginTransaction();
    try {
      $account = StudentAccounts::find($id);
      $account->delete();
      DB::commit();
      return response()->json([
        'status' => 200,
        'message' => 'Successfully deleted account',
      ], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'status' => 500,
        'message' => 'An error occurred while deleting the account.',
      ], 500);
    }

  }
}
