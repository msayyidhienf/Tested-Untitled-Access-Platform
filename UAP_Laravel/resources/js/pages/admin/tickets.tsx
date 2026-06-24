import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';

interface TicketRow {
    id: number;
    name: string;
    email: string;
    category: string;
    message: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
}

interface TicketsProps {
    tickets: TicketRow[];
}

const STATUS_CLASS: Record<string, string> = {
    open: 'uap-tag-accent',
    in_progress: 'uap-tag-warning',
    resolved: 'uap-tag-green',
    closed: '',
};

export default function AdminTickets({ tickets }: TicketsProps) {
    const updateStatus = (ticket: TicketRow, status: string) => {
        router.post(`/admin/tickets/${ticket.id}/status`, { status });
    };

    const deleteTicket = (ticket: TicketRow) => {
        if (confirm('Hapus ticket ini?')) {
            router.post(`/admin/tickets/${ticket.id}/delete`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Support Tickets" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-extrabold">Support Tickets</h1>
                <span className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                    {tickets.length} total tickets
                </span>
            </div>

            <div className="uap-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Nama</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Kategori</th>
                            <th className="px-4 py-3">Pesan</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Tanggal</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-10 text-center" style={{ color: 'var(--uap-text-dim)' }}>
                                    Belum ada support ticket.
                                </td>
                            </tr>
                        )}
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-dim)' }}>
                                    #{ticket.id}
                                </td>
                                <td className="px-4 py-3">{ticket.name}</td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {ticket.email}
                                </td>
                                <td className="px-4 py-3">{ticket.category}</td>
                                <td className="max-w-[200px] truncate px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }} title={ticket.message}>
                                    {ticket.message}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`uap-tag ${STATUS_CLASS[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => updateStatus(ticket, e.target.value)}
                                            style={{ background: 'var(--uap-bg-deep)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                                            className="px-2 py-1 text-xs"
                                        >
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                        <button onClick={() => deleteTicket(ticket)} className="uap-btn uap-btn-danger uap-btn-sm">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
