<?php

namespace App\Http\Controllers\adviser;

use App\Http\Controllers\Controller;
use App\Models\admin\Proponents;
use App\Models\adviser\AdviserAvailability;
use App\Models\adviser\AdviserWeekly;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdviserWeeklyController extends Controller
{
    //
    public function getSchedules()
    {
        $schedules = AdviserWeekly::orderBy('created_at', 'desc')->get();
        $availability = AdviserAvailability::orderBy('created_at', 'desc')->get();
        $projects = Proponents::with('details.student:id,student_id,program_id,name', 'details.student.program:id,name,code', 'adviser', 'adviser.department:id,name,code')->orderBy('created_at', 'asc')->get();

        return response()->json([
            'status' => 200,
            'schedules' => $schedules,
            'projects' => $projects,
            'availability' => $availability,
        ], 200);
    }
    public function updateSchedule(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $schedule = AdviserWeekly::find($id);
            $schedule->update($request->only(['status', 'feedback']));

            DB::commit();
            return response()->json(['status' => 200, 'message' => "Sucessfully updated status"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update consultation schedule',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
