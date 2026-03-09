<?php

use App\Http\Controllers\admin\AccountsController;
use App\Http\Controllers\admin\AdvisersController;
use App\Http\Controllers\NewUserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\ProponentsController;
use App\Http\Controllers\admin\DepartmentsController;
use App\Http\Controllers\admin\InstructorsController;
use App\Http\Controllers\admin\ProgramsController;
use App\Http\Controllers\admin\RoleController;
use App\Http\Controllers\adviser\AdviserAvailabilityController;
use App\Http\Controllers\adviser\AdviserWeeklyController;
use App\Http\Controllers\adviser\DocumentCommentsController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\instructor\DocumentsDeadlineController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\student\DevelopmentProcessController;
use App\Http\Controllers\student\DocumentsController;
use App\Http\Controllers\StudentsController;
use App\Http\Controllers\TaskListsController;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
Route::post('/login', [AccountsController::class, 'loginAccount']);
Route::post('/accounts/add', [AccountsController::class, 'storeAccount']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AccountsController::class, 'logout']);
});

Route::prefix("admin")->group(function () {

    //Accounts Routes
    Route::get('accounts', [AccountsController::class, 'getData']);
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
    Route::delete('departments/delete/{id}', [DepartmentsController::class, 'deleteDepartment']);


    //Roles Routes
    Route::get('roles', [RoleController::class, 'getRoles']);
    Route::post('roles/add', [RoleController::class, 'storeRole']);
    Route::put('roles/edit/{id}', [RoleController::class, 'updateRole']);

    //Programs Routes
    Route::get('programs', [ProgramsController::class, 'getPrograms']);
    Route::post('programs/add', [ProgramsController::class, 'storeProgram']);
    Route::put('programs/edit/{id}', [ProgramsController::class, 'updateProgram']);
    Route::delete('programs/delete/{id}', [ProgramsController::class, 'deleteProgram']);


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


Route::middleware(['auth:sanctum', 'role:adviser'])->prefix("adviser")->group(function () {
    //Adviser Availability
    Route::get("{id}/availabilities", [AdviserAvailabilityController::class, "getAvailabilities"]);
    Route::post("availabilities/add", [AdviserAvailabilityController::class, "storeAvailability"]);
    Route::put("availabilities/update", [AdviserAvailabilityController::class, "updateAvailabilty"]);
    Route::delete("{id}/availabilities/delete", [AdviserAvailabilityController::class, "deleteAvailability"]);

    //Adviser Weekly
    Route::put("{id}/weekly/update", [AdviserWeeklyController::class, "updateSchedule"]);

    //Adviser Comment
    Route::get('{id}/comments', [DocumentCommentsController::class, 'getComments']);
    Route::post('comments/add', [DocumentCommentsController::class, 'storeComment']);
    //Documents
    Route::get('documents/{id}', [DocumentsController::class, 'getStudentDocuments']);
});

Route::prefix("student")->group(function () {
    //Student Documents
    Route::get('documents/{id}', [DocumentsController::class, 'getDocuments']);
    Route::post('documents/add', [DocumentsController::class, 'storeDocument']);
    Route::get('{id}/download/pdf', [DocumentsController::class, 'downloadDocument']);
    Route::put('documents/passed/{id}', [DocumentsController::class, 'passDocument']);

    //Student Consultation
    Route::get('weekly', [AdviserWeeklyController::class, "getSchedules"]);
    Route::post('weekly/add', [AdviserWeeklyController::class, 'storeSchedule']);
    Route::get('deadlines/{id}', [DocumentsDeadlineController::class, 'getDeadlines']);

    //Task
    Route::get('tasks/{id}', [TaskListsController::class, 'getTaskList']);
    Route::post('tasks/add', [TaskListsController::class, 'storeTask']);
    Route::put('tasks/update/{id}', [TaskListsController::class, 'updateTask']);
    Route::delete('tasks/delete/{id}', [TaskListsController::class, 'deleteTask']);

    //Project Setup
    Route::get('project-setup', [NewUserController::class, 'getData']);
    Route::put('project-setup/updateStudent/{id}', [NewUserController::class, 'updateStudent']);
    Route::post('project-setup/storeProject/{id}', [NewUserController::class, 'storeProject']);
    Route::post('project-setup/joinProject/{id}', [NewUserController::class, 'joinProject']);

    //Development Process
    Route::get('development-process/{id}', [DevelopmentProcessController::class, 'getDevelopmentProcess']);
    Route::post('development-process/store', [DevelopmentProcessController::class, 'storeDevelopmentProcess']);
    Route::put('development-process/edit/{id}', [DevelopmentProcessController::class, 'editDevelopmentProcess']);
    Route::put('development-process/update/{id}', [DevelopmentProcessController::class, 'updateStatus']);
    Route::delete('development-process/delete/{id}', [DevelopmentProcessController::class, 'deleteDevelopmentProcess']);

    //My Groups
    Route::get('my-group/{id}', [GroupController::class, 'getProjectMembers']);
    Route::post('my-group/transfer/{id}', [GroupController::class, 'transferGroupLeader']);
    Route::put('my-group/updateRole/{id}', [GroupController::class, 'updateRoleMember']);
    Route::delete('my-group/leaveGroup/{id}', [GroupController::class, 'leaveGroup']);
});

Route::prefix("instructor")->group(function () {
    Route::get('deadlines/{id}', [DocumentsDeadlineController::class, 'getDeadlines']);
    Route::post('deadlines/add', [DocumentsDeadlineController::class, 'addDeadlines']);
    Route::put('deadlines/update/{id}', [DocumentsDeadlineController::class, 'updateDeadline']);
    Route::delete('deadlines/delete/{id}', [DocumentsDeadlineController::class, 'deleteDeadline']);

    Route::get('datas/{id}', [InstructorController::class, 'getDatas']);
    Route::get('documents/{id}', [DocumentsController::class, 'getInstructorDocuments']);

    Route::get('development-process/{id}', [DevelopmentProcessController::class, 'getInstructorDevelopmentProcess']);
    Route::put('development-process/update/{id}', [DevelopmentProcessController::class, 'updateStatus']);
});

Route::get('notifications/{id}/{role}', [NotificationsController::class, 'getNotifications']);
Route::put('notifications/read/{id}', [NotificationsController::class, 'readNotification']);
