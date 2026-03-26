<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\EmailOtps;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class EmailOtpsController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $otp = rand(100000, 999999);

        EmailOtps::updateOrInsert(
            ['email' => $request->email],
            [
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(5),
                'updated_at' => now()
            ]
        );
        Mail::to($request->email)->send(new OtpMail($otp));
        return response()->json(['message' => 'OTP sent']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);

        $record = EmailOtps::where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json(['status' => 400, 'error' => 'No OTP found'], 400);
        }

        if ($record->otp !== $request->otp) {
            return response()->json(['status' => 400, 'error' => 'Invalid OTP'], 400);
        }

        if (Carbon::now()->gt($record->expires_at)) {
            return response()->json(['status' => 400, 'error' => 'OTP expired'], 400);
        }


        return response()->json(['status' => 200, 'message' => 'Verified successfully'], 200);
    }
}
