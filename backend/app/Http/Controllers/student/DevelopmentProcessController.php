<?php

namespace App\Http\Controllers\student;

use App\Http\Controllers\Controller;
use App\Models\admin\Proponents;
use App\Models\student\DevelopmentProcess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DevelopmentProcessController extends Controller
{
    //

    public function getDevelopmentProcess($id)
    {
        $development = DevelopmentProcess::where("foreign_proponents_id", $id)->with('project')->get();

        return response()->json([
            'development' => $development,
        ], 200);
    }
    public function getInstructorDevelopmentProcess($id)
    {
        $development = DevelopmentProcess::orderBy('created_at', 'DESC')->get();
        $projects = Proponents::whereHas('groupLeader', function ($query) use ($id) {
            $query->where('instructor_id', $id);
        })->orderBy('created_at', 'ASC')->get();

        return response()->json([
            'developments' => $development,
            'projects' => $projects,
        ], 200);
    }
    public function getAdviserDevelopmentProcess($id)
    {
        $development = DevelopmentProcess::orderBy('created_at', 'DESC')->get();
        $projects = Proponents::where('adviser_id', $id)->orderBy('created_at', 'ASC')->get();

        return response()->json([
            'developments' => $development,
            'projects' => $projects,
        ], 200);
    }

    public function storeDevelopmentProcess(Request $request)
    {
        $rules = [
            'foreign_proponents_id' => 'required|string',
            'feature' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $development = DevelopmentProcess::create([
                'foreign_proponents_id' => $request->foreign_proponents_id,
                'feature' => $request->feature,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status,
            ]);

            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Sucessfully added the feature',
                'development' => $development,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        if (!$id) return;
        DB::beginTransaction();
        try {
            $development = DevelopmentProcess::findOrFail($id);
            if (($request->status === 'completed' || $request->status === 'completed-late') && $development->status === 'in-progress') {
                $development->update([
                    'status' => $request->status,
                    'completed_date' => now(),
                ]);
            }
            if ($request->status === 'in-progress') {
                $development->update([
                    'status' => $request->status,
                    'completed_date' => null,
                ]);
            }

            if ($request->status === 'checked') {
                $development->update([
                    'status' => $request->status,
                    'checked_date' => now(),
                ]);
            }
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Sucessfully updated the status',
                'development' => $development,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function editDevelopmentProcess(Request $request, $id)
    {
        $rules = [
            'foreign_proponents_id' => 'required|string',
            'feature' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $development = DevelopmentProcess::findOrFail($id)->update([
                'foreign_proponents_id' => $request->foreign_proponents_id,
                'feature' => $request->feature,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status,
            ]);
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Sucessfully updated the feature',
                'development' => $development,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteDevelopmentProcess($id)
    {
        if (!$id) return;
        DB::beginTransaction();
        try {
            $development = DevelopmentProcess::findOrFail($id);
            $development->delete();
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Sucessfully deleted the feature',
                'development' => $development,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
}
