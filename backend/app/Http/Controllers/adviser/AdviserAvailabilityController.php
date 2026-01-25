<?php

namespace App\Http\Controllers\adviser;

use App\Http\Controllers\Controller;
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
        $weeklies = AdviserWeekly::with('student:id,name','adviser','student.proponentDetail.proponent:proponents_id,title')->where("adviser_id", $id)->get();
        return response()->json([
            "status" => 200,
            "message" => "Sucessfully fetch availabilities",
            "availabilities" => $availabilities,
            "weeklies" => $weeklies,
        ]);
    }

    public function storeAvailability(Request $request)
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
                'adviser_id' => 1,
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
                'message' => 'An error occurred while registering the account.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteAvailability($id) {
        DB::beginTransaction();
        try {
            $sched = AdviserAvailability::find($id);
            $sched->delete();
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Successfully deleted schedule',
            ], 200);
        }catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while deleting the student.',
            ], 500);
        }
    }
}
