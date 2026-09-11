<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = ['student_id', 'counselor_id', 'date', 'time', 'type', 'category', 'modality', 'status', 'archived', 'course', 'section'];

    protected $appends = ['student', 'counselor', 'course', 'section'];

    protected $casts = ['date' => 'date', 'archived' => 'boolean'];

    public function studentUser()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function counselorUser()
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }

    public function getStudentAttribute(): string
    {
        return $this->studentUser?->name ?? 'Student';
    }

    public function getCounselorAttribute(): string
    {
        return $this->counselorUser?->name ?? 'Guidance Counselor';
    }

    public function getCourseAttribute(): string
    {
        return $this->attributes['course'] ?? $this->studentUser?->course ?? 'Course not provided';
    }

    public function getSectionAttribute(): string
    {
        return $this->attributes['section'] ?? $this->studentUser?->section ?? 'Section not provided';
    }
}