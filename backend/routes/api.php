<?php

use App\Http\Controllers\admin\AccountsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\ProponentsController;
use App\Http\Controllers\admin\DepartmentsController;
use App\Http\Controllers\admin\ProgramsController;
use App\Http\Controllers\admin\RoleController;

;
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


//Departments Routes
Route::get('departments', [DepartmentsController::class, 'getDepartments']);
Route::post('departments/add', [DepartmentsController::class, 'storeDepartment']);
Route::put('departments/edit/{id}', [DepartmentsController::class,'updateDepartment']);


//Roles Routes
Route::get('roles', [RoleController::class, 'getRoles']);
Route::post('roles/add', [RoleController::class,'storeRole']);
Route::put('roles/edit/{id}', [RoleController::class,'updateRole']);

//Programs Routes
Route::get('programs', [ProgramsController::class,'getPrograms']);
Route::post('programs/add', [ProgramsController::class,'storeProgram']);
Route::put('programs/edit/{id}', [ProgramsController::class,'updateProgram']);