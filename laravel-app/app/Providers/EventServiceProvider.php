<?php

namespace App\Providers;

use App\Events\UserCreatedByAdmin;
use App\Listeners\SendUserCreatedEmail;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        UserCreatedByAdmin::class => [
            SendUserCreatedEmail::class,
        ],
    ];

    public function boot(): void
    {
    }
}
