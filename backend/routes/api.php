<?php

use App\Http\Controllers\admin\AccountsController;
use App\Http\Controllers\admin\AdvisersController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\ProponentsController;
use App\Http\Controllers\admin\DepartmentsController;
use App\Http\Controllers\admin\InstructorsController;
use App\Http\Controllers\admin\ProgramsController;
use App\Http\Controllers\admin\RoleController;
use App\Http\Controllers\adviser\AdviserAvailabilityController;
use App\Http\Controllers\adviser\AdviserWeeklyController;
use App\Http\Controllers\adviser\DocumentCommentsController;
use App\Http\Controllers\student\DocumentsController;
use App\Http\Controllers\StudentsController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix("admin")->group(function () {

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
    Route::put('departments/edit/{id}', [DepartmentsController::class, 'updateDepartment']);


    //Roles Routes
    Route::get('roles', [RoleController::class, 'getRoles']);
    Route::post('roles/add', [RoleController::class, 'storeRole']);
    Route::put('roles/edit/{id}', [RoleController::class, 'updateRole']);

    //Programs Routes
    Route::get('programs', [ProgramsController::class, 'getPrograms']);
    Route::post('programs/add', [ProgramsController::class, 'storeProgram']);
    Route::put('programs/edit/{id}', [ProgramsController::class, 'updateProgram']);


    //Advisers Routes
    Route::get('advisers', [AdvisersController::class,  'getAdvisers']);
    Route::post('advisers/add', [AdvisersController::class, 'storeAdviser']);
    Route::put('advisers/edit/{id}', [AdvisersController::class, 'updateAdviser']);
    Route::delete('advisers/delete/{id}', [AdvisersController::class, 'deleteAdviser']);


    //Instructors Routes
    Route::get('instructors', [InstructorsController::class, 'getInstructors']);
    Route::post('instructors/add', [InstructorsController::class, 'storeInstructor']);
    Route::put('instructors/edit/{id}', [InstructorsController::class, 'updateInstructor']);
    Route::delete('instructors/delete/{id}', [InstructorsController::class, 'deleteInstructor']);
});


Route::prefix("adviser")->group(function() {
    //Adviser Availability
    Route::get("{id}/availabilities", [AdviserAvailabilityController::class, "getAvailabilities"]);
    Route::post("availabilities/add", [AdviserAvailabilityController::class, "storeAvailability"]);
    Route::delete("{id}/availabilities/delete", [AdviserAvailabilityController::class,"deleteAvailability"]);

    //Adviser Weekly
    Route::put("{id}/weekly/update", [AdviserWeeklyController::class,"updateSchedule"]);

    //Adviser Comment
    Route::get('{id}/comments', [DocumentCommentsController::class, 'getComments']);
    Route::post('comments/add', [DocumentCommentsController::class, 'storeComment']);
});

Route::prefix("student")->group(function() {
    //Student Documents
    Route::get('documents', [DocumentsController::class, 'getDocuments']);
    Route::post('documents/add', [DocumentsController::class, 'storeDocument']);
    Route::get('{id}/download/pdf', [DocumentsController::class,'downloadDocument']);

    //Student Consultation
    Route::get('weekly', [AdviserWeeklyController::class, "getSchedules"]);
    Route::post('weekly/add', [AdviserWeeklyController::class, 'storeSchedule']);
}); 