<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['studentUser', 'counselorUser'])->latest('date');
        $query->where('archived', $request->boolean('archived'));
        if ($request->user()->role === 'Student') {
            $query->where('student_id', $request->user()->id);
        }
        return response()->json($query->get());
    }

    public function counselors()
    {
        return response()->json(User::where('role', 'Counselor')->orderBy('name')->get(['id', 'name', 'department']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => ['required', 'date'],
            'time' => ['required', 'string', 'max:50'],
            'type' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:Academic Advising,Personal Counseling,Career Guidance'],
            'modality' => ['required', 'in:Face-to-Face,Online Video Call'],
            'course' => ['required', 'string', 'max:100'],
            'section' => ['required', 'string', 'max:100'],
            'counselor_id' => ['nullable', 'exists:users,id'],
        ]);
        $data['student_id'] = $request->user()->id;
        $data['status'] = 'Pending';
        return response()->json(Appointment::create($data)->load(['studentUser', 'counselorUser']), 201);
    }

    public function update(Request $request, Appointment $appointment)
    {
        abort_if($request->user()->role === 'Student', 403);
        $data = $request->validate(['status' => ['sometimes', 'required', 'in:Pending,Confirmed,Declined'], 'archived' => ['sometimes', 'boolean']]);
        if ($request->user()->role === 'Counselor' && !$appointment->counselor_id) {
            $data['counselor_id'] = $request->user()->id;
        }
        $appointment->update($data);
        return response()->json($appointment->load(['studentUser', 'counselorUser']));
    }
}