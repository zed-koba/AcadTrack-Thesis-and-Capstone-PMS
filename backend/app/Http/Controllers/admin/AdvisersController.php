<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\admin\Accounts;
use App\Models\admin\Advisers;
use App\Models\admin\Departments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdvisersController extends Controller
{
    //

    public function getAdvisers(Request $request)
    {
        $advisers = Advisers::with('account:id,email')->orderBy('created_at', 'DESC')->get();
        $departments = Departments::where('status', 'active')->orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' => 200,
            'advisers' => $advisers,
            'departments' => $departments,
        ], 200);
    }

    public function storeAdviser(Request $request)
    {
        $rules = [
            'name' => 'required|string',
            'contact_number' => 'nullable|regex:/^([0-9\s\-\+\(\)]*)$/|max:11',
            'status' => 'in:active,inactive|required',
            'email' => 'required|email|unique:accounts,email'
        ];
        $messages = [
            'email.unique' => 'Email already exists',
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
            $advisers = Advisers::create([
                'name' => $request->name,
                'account_id' => 1,
                'contact_number' => $request->contact_number,
                'department_id' => $request->department_id,
                'status' => $request->status,
            ]);
            $account = Accounts::create([
                'email' => $request->email,
                'password' => '123',
                'status' => 'pending',
                'role' => 'adviser',
            ]);
            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Adviser added sucessfully'
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
}
