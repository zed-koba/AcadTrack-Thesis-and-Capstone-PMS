<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\admin\ProponentsDetails;
use Illuminate\Http\Request;
use App\Models\admin\Accounts;
use App\Models\admin\Advisers;
use App\Models\admin\Instructors;
use App\Models\admin\Proponents;
use App\Models\admin\Students;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AccountsController extends Controller
{
  //
  public function getData()
  {
    $accounts = Accounts::orderBy('created_at', 'DESC')->get();
    return response()->json([
      'status' => 200,
      'data' => $accounts,
    ]);
  }

  public function storeAccount(Request $request)
  {
    $rules = [
      'email' => 'required|email|unique:accounts,email',
      'name' => 'required|string|unique:instructors,name|unique:students,name|unique:advisers,name',
      'password' => 'required',
    ];
    $messages = [
      'student_id.unique' => 'Student ID already exists',
      'email.unique:accounts,email' => 'Email already exists',
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
      $account = new Accounts();
      $account->email = $request->email;
      $account->password = Hash::make($request->password);
      $account->role = $request->role;
      $account->save();
      $token = $account->createToken('auth_token')->plainTextToken;
      if ($request->role === 'student') {
        $account->student()->create([
          'name' => $request->name,
          'student_id' => $request->student_id,
          'program' => $request->program,
          'section' => $request->section,
          'department_id' => $request->department_id,
        ]);
      } else if ($request->role === 'instructor') {
        $account->instructor()->create([
          'name' => $request->name,
          'account_id' => $account->id,
          'status' => 'active',
          'department_id' => $request->department_id,
        ]);
      } else if ($request->role === 'adviser') {
        $account->adviser()->create([
          'name' => $request->name,
          'account_id' => $account->id,
          'status' => 'active',
          'department_id' => $request->department_id,
        ]);
      }


      DB::commit();
      return response()->json([
        'status' => 200,
        'message' => 'Successfully registered',
        'token' => $token,
      ]);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json([
        'status' => 500,
        'message' => 'An error occurred while registering the account.',
        'error' => $e->getMessage(),
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
      $account = Accounts::find($id);
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
      $account = Accounts::find($id);
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

  public function loginAccount(Request $request)
  {
    $rules = [
      'email' => 'required|email',
      'password' => 'required',
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
    if ($request->email === "admin@gmail.com" && $request->password === "123123123") {
      return response()->json([
        'status' => 200,
        'message' => 'Successfully logged in',
        'user' => 'admin', 
      ], 200);
    }
    $account = Accounts::where('email', $request->email)->first();

    if (!$account || !Hash::check($request->password, $account->password)) {
      return response()->json([
        'status' => 401,
        'message' => 'Invalid email or password',
      ], 401);
    }
    $token = $account->createToken('auth_token')->plainTextToken;
    $project = null;
    switch ($account->role) {
      case 'student':
        $data = Students::where('account_id', $account->id)->first();
        $project = Proponents::select("proponents_id")->where("student_id", $data->id)->first();
        if (!$project) {
          $project = ProponentsDetails::select("foreign_proponents_id as proponents_id")->where("student_id", $data->id)->first();
        }
        break;
      case 'instructor':
        $data = Instructors::where('account_id', $account->id)->first();
        break;
      case 'adviser':
        $data = Advisers::where('account_id', $account->id)->first();
        break;
    }

    return response()->json([
      'status' => 200,
      'message' => 'Successfully logged in',
      'user' => $account,
      'token' => $token,
      'data' => $data,
      'project' => $project,
    ], 200);
  }
  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'message' => 'Logged out'
    ]);
  }
}
