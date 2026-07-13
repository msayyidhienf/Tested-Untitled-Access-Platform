import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';

interface OrderItemRow {
    id: number;
    price: string;
    game: { id: number; title: string } | null;
}

interface OrderRow {
    id: number;
    total: string;
    status: 'pending' | 'paid' | 'cancelled';
    created_at: string;
    user: { id: number; username: string; email: string } | null;
    items: OrderItemRow[];
}

interface OrdersProps {
    orders: OrderRow[];
    status: string;
    stats: {
        totalOrders: number;
        totalRevenue: string;
        cancelledOrders: number;
    };
}

const STATUS_CLASS: Record<string, string> = {
    pending: 'uap-tag-warning',
    paid: 'uap-tag-green',
    cancelled: 'uap-tag-danger',
};

function formatPrice(value: string | number) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

const FILTERS = [
    { key: '', label: 'All' },
    { key: 'paid', label: 'Paid' },
    { key: 'pending', label: 'Pending' },
    { key: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrders({ orders, status, stats }: OrdersProps) {
    const filterBy = (key: string) => {
        router.get('/admin/orders', key ? { status: key } : {});
    };

    const refundOrder = (order: OrderRow) => {
        if (confirm(`Refund order #${order.id} (${formatPrice(order.total)}) to ${order.user?.username}'s Ucash balance?`)) {
            router.post(`/admin/orders/${order.id}/refund`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Orders" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-extrabold">Orders</h1>
                <span className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="uap-card p-4 text-center">
                    <p className="text-2xl font-extrabold">{stats.totalOrders}</p>
                    <p className="mt-1 text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Total Orders
                    </p>
                </div>
                <div className="uap-card p-4 text-center">
                    <p className="text-2xl font-extrabold">{formatPrice(stats.totalRevenue)}</p>
                    <p className="mt-1 text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Total Revenue
                    </p>
                </div>
                <div className="uap-card p-4 text-center">
                    <p className="text-2xl font-extrabold">{stats.cancelledOrders}</p>
                    <p className="mt-1 text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Cancelled / Refunded
                    </p>
                </div>
            </div>

            <div className="mb-4 flex gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => filterBy(f.key)}
                        className={`uap-tag ${status === f.key ? 'uap-tag-accent' : ''}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="uap-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center" style={{ color: 'var(--uap-text-dim)' }}>
                                    No orders found.
                                </td>
                            </tr>
                        )}
                        {orders.map((order) => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-dim)' }}>
                                    #{order.id}
                                </td>
                                <td className="px-4 py-3">
                                    <p>{order.user?.username ?? 'Deleted user'}</p>
                                    <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                        {order.user?.email}
                                    </p>
                                </td>
                                <td className="max-w-[240px] truncate px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {order.items.map((item) => item.game?.title ?? 'Unknown game').join(', ')}
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {formatPrice(order.total)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`uap-tag ${STATUS_CLASS[order.status]}`}>{order.status}</span>
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-4 py-3">
                                    {order.status === 'paid' && (
                                        <button onClick={() => refundOrder(order)} className="uap-btn uap-btn-danger uap-btn-sm">
                                            Refund
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
