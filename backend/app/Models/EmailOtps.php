<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailOtps extends Model
{
    //
    protected $table='email_otps';
    protected $fillable = ['email', 'otp', 'expires_at'];
}
