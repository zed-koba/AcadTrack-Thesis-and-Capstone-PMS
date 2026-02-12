<?php

namespace App\Http\Controllers;

use App\Models\Notifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationsController extends Controller
{
    //

    public function getNotifications() {
        $notification = Notifications::with('student:id,name','project:proponents_id,title', 'adviser:id,name')->orderBy('created_at', 'DESC')->get();
        
        return response()->json([
            'status' => 200,
            'notifications' => $notification,
        ], 200);
    }

    public function readNotification($id) {
        try {
            if(!$id) return;
            DB::beginTransaction();
            $notification = Notifications::findOrFail($id)->update([
                'read_at' => now(),
            ]); 
            DB::commit();
            return response()->json([
                'status' => 200,
            ], 200);
        }catch(\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while registering the account.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
