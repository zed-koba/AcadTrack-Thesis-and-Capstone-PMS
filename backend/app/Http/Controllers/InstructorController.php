<?php

namespace App\Http\Controllers;

use App\Models\admin\Proponents;
use App\Models\adviser\AdviserWeekly;
use App\Models\instructor\DocumentsDeadline;
use App\Models\student\DevelopmentProcess;
use App\Models\student\Documents;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    //
    public function getDatas($id)
    {
        $projects = Proponents::with('adviser', 'details', 'groupLeader:id,name,instructor_id,program_id', 'groupLeader.instructor:id,name', 'groupLeader.program:id,name,code', 'features')->whereHas('groupLeader', function ($q) use ($id) {
            $q->where('instructor_id', $id);
        })->get();
        
        $documents = Documents::whereRelation('student', 'instructor_id', $id)->whereNotNull('passed_date')->orderBy('created_at', 'DESC')->get();
        $deadlines = DocumentsDeadline::whereDate('deadline', '>=', now())
            ->whereDate('deadline', '<=', now()->addDays(14))
            ->with('instructor')
            ->get();

        return response()->json([
            'projects' => $projects,
            'documents' => $documents,
            'deadlines' => $deadlines,
            
        ], 200);
    }
    public function getAdviserDatas($id)
    {
        $projects = Proponents::with('adviser', 'details', 'groupLeader:id,name,instructor_id,program_id', 'groupLeader.instructor:id,name', 'groupLeader.program:id,name,code', 'features')->where('adviser_id', $id)
        ->get();
        
        $documents = Documents::whereRelation('student', 'instructor_id', $id)->whereNotNull('passed_date')->orderBy('created_at', 'DESC')->get();
        $deadlines = DocumentsDeadline::whereDate('deadline', '>=', now())
            ->whereDate('deadline', '<=', now()->addDays(14))
            ->with('instructor')
            ->get();

        return response()->json([
            'projects' => $projects,
            'documents' => $documents,
            'deadlines' => $deadlines,
            
        ], 200);
    }

    public function getReportsData($id) {
        $projects = Proponents::with('adviser', 'details', 'groupLeader:id,name,instructor_id,program_id', 'groupLeader.instructor:id,name', 'groupLeader.program:id,name,code', 'features')->where('adviser_id', $id)
        ->get();
        
        $documents = Documents::orderBy('created_at', 'DESC')->get();
        $deadlines = DocumentsDeadline::orderBy('created_at', 'ASC')->get();
        $weeklies = AdviserWeekly::where('adviser_id', $id)->get();
        $developments = DevelopmentProcess::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'projects' => $projects,
            'documents' => $documents,
            'deadlines' => $deadlines,
            'weeklies' => $weeklies,
            'developments' => $developments,
        ], 200);
    }
}
