<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudentAccounts;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class StudentAccountController extends Controller
{
    //
    public function getData() {
        $accounts = StudentAccounts::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' => 200,
            'data' => $accounts
        ]);
    }

    public function storeAccount(Request $request) {
        $rules = [
            'email' => 'required|email|unique:accounts,email',
            'password' => 'required',
            'student_id' => 'required|unique:accounts,student_id',
            'program' => 'required',
            'section' => 'required'
        ];
        $messages = [
            'student_id.unique' => 'Student ID already exists',
            'email.unique' => 'Email already exists',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $account = new StudentAccounts();
        $account->email = $request->email;
        $account->password = Hash::make($request->password);
        $account->student_id = $request->student_id;
        $account->role = 'student';
        $account->program = $request->program;
        $account->section = $request->section;
        $account->save();

        return response()->json([
            'status' => 200,
            'message' => 'Successfully registered'
        ]);
    }
}
