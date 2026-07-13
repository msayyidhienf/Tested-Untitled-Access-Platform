<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SupportTicketController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('support/contact', [
            'sent' => $request->boolean('sent'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'category' => 'required|string|max:100',
            'message' => 'required|string',
        ]);

        SupportTicket::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect()->route('support.contact', ['sent' => 1]);
    }
}
