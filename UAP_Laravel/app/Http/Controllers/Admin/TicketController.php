<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/tickets', [
            'tickets' => SupportTicket::orderByDesc('created_at')->get(),
        ]);
    }

    public function updateStatus(Request $request, SupportTicket $ticket): RedirectResponse
    {
        $ticket->update([
            'status' => $request->validate([
                'status' => 'required|in:open,in_progress,resolved,closed',
            ])['status'],
        ]);

        return redirect()->route('admin.tickets.index');
    }

    public function destroy(SupportTicket $ticket): RedirectResponse
    {
        $ticket->delete();

        return redirect()->route('admin.tickets.index');
    }
}
