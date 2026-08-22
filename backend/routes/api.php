<?php

use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
	'message' => 'Laravel API is running.',
]));

Route::get('students/statistics', [StudentController::class, 'statistics']);
Route::apiResource('students', StudentController::class)->parameters(['students' => 'student']);