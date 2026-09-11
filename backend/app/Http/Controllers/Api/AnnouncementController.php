<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $query = Announcement::query()->orderByDesc('pinned')->latest();
        if ($user->role !== 'Admin') {
            $query->where(function ($audience) use ($user) {
                $audience->where('audience', 'All Students')
                    ->orWhere('audience', 'All students')
                    ->when($user->role === 'Counselor', fn ($staff) => $staff->orWhere('audience', 'Counselors Only'))
                    ->when($user->course === 'BSIT', fn ($department) => $department->orWhere('audience', 'IT Department'));
            });
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        abort_if($request->user()->role === 'Student', 403);
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'audience' => ['required', 'string', 'max:100'],
            'category' => ['required', 'in:Academic,Event,Maintenance,Urgent'],
            'pinned' => ['boolean'],
            'attachment' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,doc,docx'],
        ]);
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $data['attachment_path'] = $file->store('announcements', 'public');
            $data['attachment_name'] = $file->getClientOriginalName();
            $data['attachment_mime'] = $file->getClientMimeType();
        }
        unset($data['attachment']);
        $data['user_id'] = $request->user()->id;
        return response()->json(Announcement::create($data), 201);
    }

    public function destroy(Request $request, Announcement $announcement)
    {
        abort_if($request->user()->role === 'Student', 403);
        $announcement->delete();
        return response()->json(null, 204);
    }
}