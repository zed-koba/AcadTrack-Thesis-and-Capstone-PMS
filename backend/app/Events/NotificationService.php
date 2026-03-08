<?php

namespace App\Events;

use App\Models\Notifications;
use App\Models\student\Documents;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationService
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        //
        
    }
    public static function store($data)
    {
        return Notifications::create([
            'instructor_id' => $data['student_id'] ?? null,
            'adviser_id' => $data['adviser_id'] ?? null,
            'foreign_proponents_id' => $data['foreign_proponents_id'] ?? null,
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
