<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreUserRequest;
use App\Http\Requests\Api\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function index(Request $request, UserService $userService): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'search' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', 'string', 'in:admin,manager'],
        ]);

        $users = $userService->list($validated);

        return UserResource::collection($users);
    }

    public function store(StoreUserRequest $request, UserService $userService): JsonResponse
    {
        $user = $userService->create($request->validated());

        return response()->json([
            'message' => 'User created successfully.',
            'data' => new UserResource($user),
        ], 201);
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user->load('roles'));
    }

    public function update(UpdateUserRequest $request, User $user, UserService $userService): JsonResponse
    {
        $updatedUser = $userService->update($user, $request->validated());

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => new UserResource($updatedUser),
        ]);
    }

    public function destroy(User $user, UserService $userService): JsonResponse
    {
        $userService->delete($user, auth()->id());

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}
