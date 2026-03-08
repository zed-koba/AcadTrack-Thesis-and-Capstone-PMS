<?php

namespace App\Http\Controllers;

use App\Models\Notifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class NotificationsController extends Controller
{
    //

    public function getNotifications($id, $role)
    {
        if($role === "student") {
            $notification = Notifications::where("foreign_proponents_id", $id)->with("project.groupLeader.instructor:id,name", "adviser:id,name")->orderBy('created_at', 'DESC')->get();
        }else if($role === "instructor") {
            $notification = Notifications::where('instructor_id', $id)->with("project", "project.details")->orderBy('created_at', 'DESC')->get();
        }else if($role === "adviser") {
            $notification = Notifications::where('adviser_id', $id)->with("project", "project.details")->orderBy('created_at', 'DESC')->get();
        }

        return response()->json([
            'status' => 200,
            'notifications' => $notification,
        ], 200);
    }

    public function readNotification($id)
    {
        try {
            if (!$id) return;
            DB::beginTransaction();
            $notification = Notifications::findOrFail($id)->update([
                'read_at' => now(),
            ]);
            DB::commit();
            return response()->json([
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while registering the account.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeNotification(Request $request)
    {
        $rules = [
            'instructor_id' => 'nullable|integer',
            'adviser_id' => 'nullable|integer',
            'foreign_proponents_id' => 'required|string',
            'type' => 'required|string',
            'message' => 'required|string',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
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
