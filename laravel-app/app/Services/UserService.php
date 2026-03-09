<?php

namespace App\Services;

use App\Events\UserCreatedByAdmin;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class UserService
{
    public function list(array $filters): LengthAwarePaginator
    {
        $perPage = (int) ($filters['per_page'] ?? 10);
        $cacheVersion = (int) Cache::get('users:index:cache-version', 1);
        $cacheKey = sprintf(
            'users:index:v%s:%s',
            $cacheVersion,
            md5(json_encode([
                'page' => $filters['page'] ?? 1,
                'per_page' => $perPage,
                'search' => $filters['search'] ?? null,
                'role' => $filters['role'] ?? null,
            ]))
        );

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($filters, $perPage) {
            return User::query()
                ->with('roles')
                ->when(
                    ! empty($filters['search']),
                    fn ($query) => $query->where(function ($searchQuery) use ($filters) {
                        $searchQuery
                            ->where('name', 'like', '%'.$filters['search'].'%')
                            ->orWhere('email', 'like', '%'.$filters['search'].'%');
                    })
                )
                ->when(
                    ! empty($filters['role']),
                    fn ($query) => $query->role($filters['role'])
                )
                ->latest()
                ->paginate($perPage)
                ->withQueryString();
        });
    }

    public function create(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $user->syncRoles([$data['role']]);

        event(new UserCreatedByAdmin($user));
        $this->bumpUsersIndexCacheVersion();

        return $user->load('roles');
    }

    public function update(User $user, array $data): User
    {
        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        if (! empty($data['password'])) {
            $payload['password'] = $data['password'];
        }

        $user->update($payload);

        if (! empty($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        $this->bumpUsersIndexCacheVersion();

        return $user->load('roles');
    }

    public function delete(User $user, int|string|null $actorId = null): void
    {
        abort_if(
            (string) $actorId === (string) $user->id,
            422,
            'You cannot delete your own account.'
        );

        $user->delete();
        $this->bumpUsersIndexCacheVersion();
    }

    private function bumpUsersIndexCacheVersion(): void
    {
        if (! Cache::has('users:index:cache-version')) {
            Cache::forever('users:index:cache-version', 1);
        }

        Cache::increment('users:index:cache-version');
    }
}
