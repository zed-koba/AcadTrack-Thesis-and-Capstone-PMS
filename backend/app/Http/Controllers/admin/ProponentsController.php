<?php

namespace App\Http\Controllers\admin;

use Illuminate\Http\Request;
use App\Models\Proponents;
use App\Models\ProponentsDetails;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProponentsController extends Controller
{
  //
  public function getProponents()
  {
    $proponents = Proponents::with('details')->orderBy('created_at', 'DESC')->get();

    return response()->json([
      'status' => 200,
      'data' => $proponents,
    ]);
  }

  public function storeProponent(Request $request)
  {
    $rules = [
      'academic_yr' => 'required|string',
      'semester' => 'required|integer',
      'title' => 'required|string',
      'adviser' => 'required|string',
      'program' => 'required',
      'details' => 'required|array|max:4',
      'details.*.name' => 'required|string',
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
    DB::beginTransaction();
    try {
      $proponents = Proponents::create([
        'academic_yr' => $request->academic_yr,
        'semester' => (int) $request->semester,
        'title' => $request->title,
        'adviser' => $request->adviser,
        'program' => $request->program,
      ]);
      foreach ($request->details as $detail) {
        ProponentsDetails::create([
          'foreign_proponents_id' => $proponents->proponents_id,
          'name' => $detail['name'],
        ]);
      }

      DB::commit();
      return response()->json(
        [
          'status' => 201,
          'message' => 'Sucessfully added Proponent',
          'data' => [
            'proponent' => $proponents,
            'details' => $request->details,
          ],
        ],
        201,
      );
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(
        [
          'error' => $e->getMessage(),
        ],
        500,
      );
    }
  }

  public function updateProponent($id, Request $request) {
    $rules = [
      'academic_yr' => 'required|string',
      'semester' => 'required|integer',
      'title' => 'required|string',
      'adviser' => 'required|string',
      'program' => 'required',
      'details' => 'required|array|max:4',
      'details.*.name' => 'required|string',
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
    DB::beginTransaction();
    try {
      $proponents = Proponents::find($id);
      $proponents->update($request->only(['academic_yr', 'semester', 'title', 'program', 'adviser']));
      foreach($request->details as $detail) {
        if(isset($detail['propsdetails_id'])) {
          $detailModel = ProponentsDetails::find($detail['propsdetails_id']);
          $detailModel->update(['name' => $detail['name']]);
        }else{
          ProponentsDetails::create([
            'foreign_proponents_id' => $proponents->proponents_id,
            'name' => $detail["name"],
          ]);
        }
      }

      if(!empty($request->deleted_ids)) {
        ProponentsDetails::whereIn('propsdetails_id', $request->deleted_ids)->delete();
      }
      DB::commit();
      return response()->json([
        'status' => 200,
        'message' => 'Sucessfully updated the proponent',
        'data' => [
          'proponent' => $proponents,
          'details' => $request->details,
        ]
      ], 200);
    }catch(\Exception $e) {
      DB::rollBack();
      return response()->json([
        'error' => $e->getMessage(),
      ], 500);
    }
  }
}
