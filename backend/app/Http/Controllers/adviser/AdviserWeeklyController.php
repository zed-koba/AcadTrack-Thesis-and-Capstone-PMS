<?php

namespace App\Http\Controllers\adviser;

use App\Http\Controllers\Controller;
use App\Models\adviser\AdviserWeekly;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdviserWeeklyController extends Controller
{
    //
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
