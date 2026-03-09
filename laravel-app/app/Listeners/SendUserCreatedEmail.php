<?php

namespace App\Listeners;

use App\Events\UserCreatedByAdmin;
use App\Mail\UserCreatedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendUserCreatedEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public bool $afterCommit = true;

    public function handle(UserCreatedByAdmin $event): void
    {
        try {
            Mail::to($event->user->email)->send(new UserCreatedMail($event->user));
        } catch (Throwable $exception) {
            Log::warning('User created email failed.', [
                'user_id' => $event->user->id,
                'email' => $event->user->email,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
