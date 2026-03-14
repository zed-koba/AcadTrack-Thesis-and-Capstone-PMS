<?php

namespace App\Http\Controllers\adviser;

use App\Http\Controllers\Controller;
use App\Models\admin\Advisers;
use App\Models\adviser\AdviserAvailability;
use App\Models\adviser\AdviserWeekly;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdviserAvailabilityController extends Controller
{
    //
    public function getAvailabilities($id)
    {
        $availabilities = AdviserAvailability::where("adviser_id", $id)->with('adviser')->get();
        $weeklies = AdviserWeekly::with('student:id,name', 'adviser', 'student.project', 'student.project.groupLeader', 'student.project.details.student', 'student.proponentDetail.proponent', 'student.proponentDetail.proponent.groupLeader', 'student.proponentDetail.proponent.details.student')->where("adviser_id", $id)->get();
        return response()->json([
            "status" => 200,
            "message" => "Sucessfully fetch availabilities",
            "availabilities" => $availabilities,
            "weeklies" => $weeklies,
        ]);
    }

    public function storeAvailability(Request $request, $id)
    {
        $rules = [
            'day' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
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
        try {
            DB::beginTransaction();
            $availability = AdviserAvailability::create([
                'adviser_id' => $id,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'day' => $request->day,
                'is_available' => true,
            ]);

            DB::commit();
            return response()->json([
                'status' => 201,
                'message' => 'Successfully added availability',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while adding the availability.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateAvailabilty(Request $request)
    {
        $rules = [
            'id' => 'required|integer',
            'consultation_limit' => 'required|integer',
            'duration' => 'required|integer',
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
        try {
            DB::beginTransaction();
            $availability = Advisers::findOrFail($request->id)->update($request->only([
                'consultation_limit',
                'duration'
            ]));

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully updated your settings',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the settings.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function deleteAvailability($id)
    {
        DB::beginTransaction();
        try {
            $sched = AdviserAvailability::find($id);
            $sched->delete();
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully deleted schedule',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while deleting the student.',
            ], 500);
        }
    }
}
