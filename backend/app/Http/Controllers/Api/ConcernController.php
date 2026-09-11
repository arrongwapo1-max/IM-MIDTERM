<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use Illuminate\Http\Request;

class ConcernController extends Controller
{
    public function index(Request $request)
    {
        $query = Concern::with('user')->orderByDesc('pinned')->latest();
        $query->where('archived', $request->boolean('archived'));
        if ($request->user()->role === 'Student') {
            $query->where('user_id', $request->user()->id);
        } elseif ($request->user()->role !== 'Admin') {
            $query->where(function ($audience) use ($request) {
                $audience->where('audience', 'Guidance Office')
                    ->orWhere(function ($counselors) use ($request) {
                        $counselors->where('audience', 'Counselors Only')->whereRaw('? = ?', [$request->user()->role, 'Counselor']);
                    })
                    ->orWhere(function ($it) use ($request) {
                        $it->where('audience', 'IT Department')->whereRaw('? = ?', [$request->user()->course, 'BSIT']);
                    });
            });
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'course' => ['required', 'string', 'max:100'],
            'section' => ['required', 'string', 'max:100'],
            'audience' => ['required', 'in:Guidance Office,Counselors Only,IT Department'],
            'pinned' => ['boolean'],
            'attachment' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,doc,docx'],
        ]);
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $data['attachment_path'] = $file->store('concerns', 'public');
            $data['attachment_name'] = $file->getClientOriginalName();
            $data['attachment_mime'] = $file->getClientMimeType();
        }
        unset($data['attachment']);
        return response()->json($request->user()->concerns()->create($data)->load('user'), 201);
    }

    public function update(Request $request, Concern $concern)
    {
        abort_if($request->user()->role === 'Student', 403);
        $data = $request->validate(['status' => ['sometimes', 'required', 'in:Pending,In Progress,Resolved'], 'archived' => ['sometimes', 'boolean']]);
        $concern->update($data);
        return response()->json($concern->load('user'));
    }
}