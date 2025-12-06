<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\StudentAccountController;
use App\Http\Controllers\admin\ProponentsController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('accounts', [StudentAccountController::class, 'getData']);
Route::post('register', [StudentAccountController::class, 'storeAccount']);
Route::get('proponents', [ProponentsController::class, 'getProponents']);
Route::post('proponents/add', [ProponentsController::class, 'storeProponent']);
