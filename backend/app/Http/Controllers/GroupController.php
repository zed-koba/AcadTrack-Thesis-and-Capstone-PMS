<?php

namespace App\Http\Controllers;

use App\Models\admin\Accounts;
use App\Models\admin\Proponents;
use App\Models\admin\ProponentsDetails;
use App\Models\admin\Role;
use App\Models\admin\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    //
    public function getProjectMembers($id) {
        $project = Proponents::where('proponents_id', $id)->with('groupLeader', 'groupLeader.account:id,email', 'details', 'details.student', 'details.student.account:id,email', 'details.student.role:id,name')->first();
        $roles = Role::where('status', 'active')->get();

        return response()->json([
            'status' => 200,
            'project' => $project,
            'roles' => $roles,
        ], 200);
    }

    public function updateRoleMember(Request $request, $id) {
        if(!$id) return;
        DB::beginTransaction();
        try {
            $student = Students::findOrFail($id);
            $student->update([
                'role_id' => $request->role_id,
            ]);

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Sucessfully changed role',
            ], 200);
        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function leaveGroup($id) {
        if(!$id) return;

        DB::beginTransaction();
        try {
            $student = ProponentsDetails::where('student_id', $id)->first();
            $member = Students::findOrFail($id);
            Accounts::findOrFail($member->account_id)->update([
                'new_user' => 1,
            ]);


            $student->delete();

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Sucessfully left the group',
            ], 200);
        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function transferGroupLeader(Request $request, $id) {
        if(!$id) return;
        DB::beginTransaction();
        try {
            $groupLeader = Proponents::where('student_id', $id)->first();
            $groupLeader->update([
                'student_id' => $request->id,
            ]);
            $member = ProponentsDetails::where('student_id', $request->id)->first();
            $member->delete();

            $newMember = ProponentsDetails::create([
                'foreign_proponents_id' => $groupLeader->proponents_id,
                'student_id' => $id,
            ]);

            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Sucessfully transferred the leadership',
            ], 200);
        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
}
