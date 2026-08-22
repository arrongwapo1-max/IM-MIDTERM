<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StudentController extends Controller
{
    public function __construct(private StudentService $studentService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['search', 'course', 'status', 'year_level']);
        $perPage = min(max($request->integer('per_page', 15), 1), 100);

        return StudentResource::collection($this->studentService->getStudents($filters, $perPage));
    }

    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = $this->studentService->createStudent($request->validated());

        return (new StudentResource($student))->response()->setStatusCode(201);
    }

    public function show(string $student): StudentResource|JsonResponse
    {
        $result = $this->studentService->getStudent($student);

        if ($result === null) {
            return response()->json(['message' => 'Student not found.'], 404);
        }

        return new StudentResource($result);
    }

    public function update(UpdateStudentRequest $request, string $student): StudentResource|JsonResponse
    {
        $result = $this->studentService->getStudent($student);

        if ($result === null) {
            return response()->json(['message' => 'Student not found.'], 404);
        }

        return new StudentResource($this->studentService->updateStudent($result, $request->validated()));
    }

    public function destroy(string $student): JsonResponse
    {
        $result = $this->studentService->getStudent($student);

        if ($result === null) {
            return response()->json(['message' => 'Student not found.'], 404);
        }

        $this->studentService->deleteStudent($result);

        return response()->json(null, 204);
    }

    public function statistics(): JsonResponse
    {
        return response()->json($this->studentService->getStatistics());
    }
}