<?php

namespace App\Listeners;

use App\Events\NotificationService;
use App\Models\Notifications;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CreateNotificationListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NotificationService $event, Request $request)
    {
        //
        $rules = [
            'student_id' => 'required|integer',
            'adviser_id' => 'required|integer',
            'foreign_proponents_id' => 'required|string',
            'type' => 'required|string',
            'message' => 'required|string',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fail()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $notification = Notifications::create([
                'student_id' => $request->student_id,
                'adviser_id' => $request->adviser_id,
                'foreign_proponents_id' => $request->foreign_proponents_id,
                'type' => $request->type,
                'message' => $request->message,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Sucessfully inserted notification',
                'notification' => $notification,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
}
