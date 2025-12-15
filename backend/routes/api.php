<?php

use App\Http\Controllers\admin\AccountsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\ProponentsController;
use App\Http\Controllers\StudentsController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//Accounts Routes
Route::get('accounts', [AccountsController::class, 'getData']);
Route::post('accounts/add', [AccountsController::class, 'storeAccount']);
Route::put('accounts/edit/{id}', [AccountsController::class, 'updateAccount']);
Route::delete('accounts/delete/{id}', [AccountsController::class, 'deleteAccount']);

//Proponents Routes
Route::get('proponents', [ProponentsController::class, 'getProponents']);
Route::post('proponents/add', [ProponentsController::class, 'storeProponent']);
Route::put('proponents/edit/{id}', [ProponentsController::class, 'updateProponent']);
Route::delete('proponents/delete/{id}', [ProponentsController::class, 'deleteProponent']);


//Student Routes
Route::get('students', [StudentsController::class, 'getData']);
Route::post('students/add', [StudentsController::class, 'storeStudent']);
Route::put('students/edit/{id}', [StudentsController::class, 'updateStudent']);
Route::delete('students/delete/{id}', [StudentsController::class, 'deleteStudent']);
