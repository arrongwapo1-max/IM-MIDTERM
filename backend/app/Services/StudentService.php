<?php

namespace App\Services;

use App\Models\Student;
use App\Repositories\Contracts\StudentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class StudentService
{
    public function __construct(private StudentRepositoryInterface $studentRepository)
    {
    }

    public function getStudents(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->studentRepository->paginate($filters, $perPage);
    }

    public function getStudent(string $id): ?Student
    {
        return $this->studentRepository->find($id);
    }

    public function createStudent(array $data): Student
    {
        $this->ensureMinimumAge($data);

        return $this->studentRepository->create($data);
    }

    public function updateStudent(Student $student, array $data): Student
    {
        $this->ensureMinimumAge(array_merge($student->toArray(), $data));

        return $this->studentRepository->update($student, $data);
    }

    public function deleteStudent(Student $student): bool
    {
        return $this->studentRepository->delete($student);
    }

    public function getStatistics(): array
    {
        return $this->studentRepository->statistics();
    }

    private function ensureMinimumAge(array $data): void
    {
        if (($data['age'] ?? 0) < 15) {
            throw ValidationException::withMessages(['age' => 'Students must be at least 15 years old.']);
        }
    }
}