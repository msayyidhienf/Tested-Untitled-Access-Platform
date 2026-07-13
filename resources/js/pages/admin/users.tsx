import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface UserRow {
    id: number;
    username: string;
    email: string;
    role: string;
    country: string | null;
    created_at: string;
}

interface UsersProps {
    users: UserRow[];
    search: string;
}

export default function AdminUsers({ users, search }: UsersProps) {
    const [query, setQuery] = useState(search);

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search: query || undefined });
    };

    const toggleRole = (user: UserRow) => {
        router.post(`/admin/users/${user.id}/role`, { role: user.role === 'admin' ? 'user' : 'admin' });
    };

    const deleteUser = (user: UserRow) => {
        if (confirm(`Delete user ${user.username}?`)) {
            router.post(`/admin/users/${user.id}/delete`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Users" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-extrabold">Users Management</h1>
                <span className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                    {users.length} total users
                </span>
            </div>

            <form onSubmit={submitSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by username or email..."
                    style={{ background: 'var(--uap-bg-card)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                    className="flex-1 px-3 py-2 text-sm outline-none"
                />
                <button type="submit" className="uap-btn uap-btn-primary">
                    Search
                </button>
            </form>

            <div className="uap-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Username</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Country</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center" style={{ color: 'var(--uap-text-dim)' }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-dim)' }}>
                                    #{user.id}
                                </td>
                                <td className="px-4 py-3">{user.username}</td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {user.email}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`uap-tag ${user.role === 'admin' ? 'uap-tag-accent' : ''}`}>{user.role}</span>
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {user.country ?? '-'}
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => toggleRole(user)} className="uap-btn uap-btn-outline uap-btn-sm">
                                            {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                                        </button>
                                        <button onClick={() => deleteUser(user)} className="uap-btn uap-btn-danger uap-btn-sm">
                                            Delete
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
