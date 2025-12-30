<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\admin\Departments;
use App\Models\admin\Role;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function getRoles()
    {
        $roles = Role::orderBy('created_at', 'DESC')->get();
        $departments = Departments::where('status', 'active')->orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' => 200,
            'roles' => $roles,
            'departments' => $departments,
        ], 200);
    }

    public function storeRole(Request $request)
    {
        $rules = [
            'name' => 'required|string',
            'description' => 'nullable|string',
            'globalRole' => 'required|boolean',
            'department_id' => 'nullable|integer',
            'status' => 'in:active,inactive|required',
        ];

        $messages = [
            'name.required' => 'Name field is required',
            'department_id.in' => 'Must select a status',
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
            $role = Role::create([
                'name' => $request->name,
                'description' => $request->description,
                'globalRole' => $request->globalRole,
                'assigned' => 0,
                'department_id' => $request->department_id,
                'status' => $request->status,
            ]);
            DB::commit();
            return response()->json([
                'status'=> 201,
                'message' => 'Role added successfully',              
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to insert role',
                'error'=> $e->getMessage()
            ], 500);
        }
    }

    public function updateRole(Request $request, $id)
    {
        $rules = [
            'name' => 'required|string',
            'description' => 'nullable|string',
            'globalRole' => 'required|boolean',
            'department_id' => 'nullable|integer',
            'status' => 'in:active,inactive|required',
        ];

        $messages = [
            'name.required' => 'Name field is required',
            'department_id.in' => 'Must select a status',
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
            $role = Role::find($id);
            $role->update($request->only(['name', 'description', 'globalRole', 'department_id','status']));
            DB::commit();
            return response()->json([
                'status'=> 200,
                'message' => 'Role updated successfully',              
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to insert role',
            ], 500);
        }
    }
}
