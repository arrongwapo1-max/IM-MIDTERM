<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasUuids;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'age',
        'course',
        'year_level',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'year_level' => 'integer',
        ];
    }
}