<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\admin\Departments;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepartmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getDepartments()
    {
        $departments = Departments::withCount(['programs', 'advisers', 'roles'])->orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data'=> $departments,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function storeDepartment(Request $request)
    {
        $rules = [
            'name' => 'required|string|unique:departments,name',
            'code' => 'required|string|unique:departments,code',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive|required',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status'=> 422,
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $department = Departments::create([
                'name' => $request->name,
                'code' => $request->code,
                'description' => $request->description,
                'status' => $request->status,
            ]);
            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Department added successfully',
            ], 201);

        }catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to insert department',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function updateDepartment(Request $request, $id)
    {
        $rules = [
            'name' => 'required|string|unique:departments,name,' . $id,
            'code' => 'required|string|unique:departments,code,' . $id,
            'description' => 'nullable|string',
            'status' => 'in:active,inactive|required',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status'=> 422,
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $department = Departments::find($id);
            $department->update($request->only(['name', 'code', 'description', 'status']));
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Department updated successfully',
                'data' => $department,
            ], 200);

        }catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update department',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Departments $departments)
    {
        //
    }
}
