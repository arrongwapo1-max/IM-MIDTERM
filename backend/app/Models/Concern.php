<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Concern extends Model
{
    protected $fillable = ['user_id', 'title', 'content', 'category', 'audience', 'pinned', 'attachment_path', 'attachment_name', 'attachment_mime', 'status', 'archived', 'course', 'section'];

    protected $appends = ['student', 'course', 'section', 'submitted', 'attachment_url'];

    protected function casts(): array
    {
        return ['pinned' => 'boolean', 'archived' => 'boolean'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getStudentAttribute(): string
    {
        return $this->user?->name ?? 'Student';
    }

    public function getCourseAttribute(): string
    {
        return $this->attributes['course'] ?? $this->user?->course ?? 'Course not provided';
    }

    public function getSectionAttribute(): string
    {
        return $this->attributes['section'] ?? $this->user?->section ?? 'Section not provided';
    }

    public function getSubmittedAttribute(): string
    {
        return $this->created_at?->format('M d, Y') ?? '';
    }

    public function getAttachmentUrlAttribute(): ?string
    {
        return $this->attachment_path ? asset('storage/'.$this->attachment_path) : null;
    }
}