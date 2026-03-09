<?php

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return UserResource::make($request->user()->load('roles'))->resolve();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware(['role:admin', 'throttle:60,1'])->group(function () {
        Route::apiResource('users', UserController::class);
    });
});
