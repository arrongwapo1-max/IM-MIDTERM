<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetCode extends Notification
{
    use Queueable;

    public function __construct(private readonly string $code)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your ComfyHub password recovery code')
            ->greeting('Password recovery requested')
            ->line('Use this six-digit code to reset your ComfyHub password:')
            ->line($this->code)
            ->line('This code expires in 15 minutes. If you did not request this, you can ignore this email.');
    }
}
