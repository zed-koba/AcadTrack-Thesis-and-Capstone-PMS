<?php

namespace App\Http\Controllers\adviser;

use App\Http\Controllers\Controller;
use App\Models\admin\Proponents;
use App\Models\adviser\AdviserAvailability;
use App\Models\adviser\AdviserWeekly;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

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
            if(!$id) return;
            DB::beginTransaction();
            $schedule = AdviserWeekly::findOrFail($id);
            $schedule->update($request->only(['status', 'feedback', 'actual_start', 'actual_end']));

            DB::commit();
            return response()->json(['status' => 200, 'message' => "Sucessfully updated status", 'request' => $schedule], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update consultation schedule',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeSchedule(Request $request)
    {
        $rules = [
            'adviser_id' => 'required|integer|',
            'student_id' => 'required|integer|',
            'date' => 'required|date|date_format:Y-m-d|',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'purpose' => 'required|string',
        ];

        $messages = [
            'adviser_id.required' => 'Adviser id must be required',
            'adviser_id.integer' => 'Adviser id must be a number',
            'student_id.required' => 'Student id must be required',
            'student_id.integer' => 'Student id must be a number',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Failed to store schedule',
                'request' => $request->all(),
                'error' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();
            $schedule = AdviserWeekly::create([
                'adviser_id' => $request->adviser_id,
                'student_id' => $request->student_id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'purpose' => $request->purpose,
                'status' => 'upcoming',
            ]);
            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Consultation request booked',
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while storing the schedule.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
