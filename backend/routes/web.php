<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/reset-password/{token}', function (Request $request, string $token) {
    $query = http_build_query([
        'token' => $token,
        'email' => $request->query('email'),
    ]);

    return redirect()->away('http://localhost:5173/reset-password?'.$query);
})->name('password.reset');
