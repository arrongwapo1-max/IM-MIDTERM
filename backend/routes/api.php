<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConcernController;
use App\Http\Middleware\ApiToken;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
	Route::post('register', [AuthController::class, 'register']);
	Route::post('login', [AuthController::class, 'login']);
	Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
	Route::post('reset-password', [AuthController::class, 'resetPassword']);

	Route::middleware(ApiToken::class)->group(function () {
		Route::get('me', [AuthController::class, 'me']);
		Route::post('logout', [AuthController::class, 'logout']);
	});
});

Route::middleware(ApiToken::class)->group(function () {
	Route::get('appointment-counselors', [AppointmentController::class, 'counselors']);
	Route::apiResource('concerns', ConcernController::class)->only(['index', 'store', 'update']);
	Route::apiResource('appointments', AppointmentController::class)->only(['index', 'store', 'update']);
	Route::apiResource('announcements', AnnouncementController::class)->only(['index', 'store', 'destroy']);
});