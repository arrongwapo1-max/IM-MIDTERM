<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Repositories\Contracts\StudentRepositoryInterface;
use App\Repositories\StudentRepository;
use App\Services\StudentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentApiTest extends TestCase
{
    use RefreshDatabase;

    private function studentData(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Arron',
            'last_name' => 'Babatuan',
            'email' => 'Arronbabatuan@gmail.com',
            'age' => 20,
            'course' => 'BSIT',
            'year_level' => 3,
            'status' => 'active',
        ], $overrides);
    }

    public function test_it_creates_a_student(): void
    {
        $response = $this->postJson('/api/students', $this->studentData());

        $response->assertCreated()->assertJsonPath('data.email', 'john@example.com');
        $this->assertDatabaseHas('students', ['email' => 'john@example.com']);
    }

    public function test_it_rejects_invalid_and_duplicate_email_data(): void
    {
        $this->postJson('/api/students', $this->studentData(['age' => 14]))->assertUnprocessable();
        $this->postJson('/api/students', $this->studentData());
        $this->postJson('/api/students', $this->studentData())->assertUnprocessable();
    }

    public function test_it_lists_searchable_filtered_paginated_students(): void
    {
        Student::query()->create($this->studentData());
        Student::query()->create($this->studentData([
            'first_name' => 'Jane',
            'email' => 'jane@example.com',
            'course' => 'Design',
            'status' => 'inactive',
        ]));

        $this->getJson('/api/students?search=john&course=Computer%20Science&status=active&per_page=1')
            ->assertOk()
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.first_name', 'John');
    }

    public function test_it_shows_updates_and_deletes_a_student(): void
    {
        $student = Student::query()->create($this->studentData());

        $this->getJson("/api/students/{$student->id}")->assertOk();
        $this->putJson("/api/students/{$student->id}", ['email' => $student->email, 'age' => 21])
            ->assertOk()->assertJsonPath('data.age', 21);
        $this->deleteJson("/api/students/{$student->id}")->assertNoContent();
        $this->getJson("/api/students/{$student->id}")->assertNotFound();
    }

    public function test_it_returns_not_found_for_unknown_students(): void
    {
        $id = '00000000-0000-0000-0000-000000000000';

        $this->getJson("/api/students/{$id}")->assertNotFound();
        $this->deleteJson("/api/students/{$id}")->assertNotFound();
    }

    public function test_the_service_is_resolved_with_the_repository_abstraction(): void
    {
        $this->assertInstanceOf(StudentRepository::class, $this->app->make(StudentRepositoryInterface::class));
        $this->assertInstanceOf(StudentService::class, $this->app->make(StudentService::class));
    }
}