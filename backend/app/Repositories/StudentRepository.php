<?php

namespace App\Repositories;

use App\Models\Student;
use App\Repositories\Contracts\StudentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StudentRepository implements StudentRepositoryInterface
{
    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        return Student::query()
            ->when($filters['search'] ?? null, function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['course'] ?? null, fn ($query, string $course) => $query->where('course', $course))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['year_level'] ?? null, fn ($query, int $yearLevel) => $query->where('year_level', $yearLevel))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(string $id): ?Student
    {
        return Student::query()->find($id);
    }

    public function create(array $data): Student
    {
        return Student::query()->create($data);
    }

    public function update(Student $student, array $data): Student
    {
        $student->update($data);

        return $student->refresh();
    }

    public function delete(Student $student): bool
    {
        return (bool) $student->delete();
    }

    public function statistics(): array
    {
        return [
            'total_students' => Student::query()->count(),
            'active_students' => Student::query()->where('status', 'active')->count(),
            'inactive_students' => Student::query()->where('status', 'inactive')->count(),
        ];
    }
}