<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\PasswordResetCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', 'in:Student,Counselor,Admin'],
            'student_id' => ['nullable', 'string', 'max:50'],
            'course' => ['nullable', 'string', 'max:100'],
            'section' => ['nullable', 'string', 'max:100'],
            'department' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $user = User::create([
            ...$data,
            'password' => Hash::make($data['password']),
        ]);

        return $this->tokenResponse($user);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'role' => ['nullable', 'in:Student,Counselor,Admin'],
        ]);
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 422);
        }

        if (!empty($data['role']) && $data['role'] !== $user->role) {
            return response()->json(['message' => 'The selected role does not match this account.'], 422);
        }

        return $this->tokenResponse($user);
    }

    public function forgotPassword(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $data['email'])->first();
        if ($user) {
            $code = (string) random_int(100000, 999999);
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                ['token' => Hash::make($code), 'created_at' => now()],
            );
            Notification::route('mail', $user->email)->notify(new PasswordResetCode($code));
        }

        return response()->json([
            'message' => 'If an account matches that email, a six-digit recovery code will be sent shortly.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);
        $reset = DB::table('password_reset_tokens')->where('email', $data['email'])->first();
        if (!$reset || now()->diffInMinutes($reset->created_at) > 15 || !Hash::check($data['code'], $reset->token)) {
            return response()->json(['message' => 'The recovery code is invalid or expired.'], 422);
        }
        $user = User::where('email', $data['email'])->firstOrFail();
        $user->update(['password' => Hash::make($data['password'])]);
        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
        return response()->json(['message' => 'Your password has been reset successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->forceFill(['api_token_hash' => null])->save();
        return response()->json(['message' => 'Logged out.']);
    }

    private function tokenResponse(User $user)
    {
        $token = Str::random(64);
        $user->forceFill(['api_token_hash' => hash('sha256', $token)])->save();
        return response()->json(['token' => $token, 'user' => $user]);
    }
}