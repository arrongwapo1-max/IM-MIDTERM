<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = ['title', 'body', 'audience', 'category', 'pinned', 'attachment_path', 'attachment_name', 'attachment_mime', 'user_id'];

    protected $appends = ['date'];

    public function getDateAttribute(): string
    {
        return $this->created_at?->format('M d, Y') ?? '';
    }

    public function getAttachmentUrlAttribute(): ?string
    {
        return $this->attachment_path ? asset('storage/'.$this->attachment_path) : null;
    }

    protected function casts(): array
    {
        return ['pinned' => 'boolean'];
    }
}