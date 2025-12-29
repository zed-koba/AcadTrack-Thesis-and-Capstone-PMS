<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\admin\Role;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function getRoles()
    {
        $roles = Role::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data'=> $roles,
        ], 200);
    }
}
