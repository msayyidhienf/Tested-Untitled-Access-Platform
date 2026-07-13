import AdminLayout from '@/layouts/admin-layout';
import { type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type TransactionType = 'topup' | 'purchase' | 'refund' | 'adjustment';

interface WalletTransactionRow {
    id: number;
    reference_no: string;
    type: TransactionType;
    amount: string;
    balance_after: string;
    description: string | null;
    created_at: string;
    user: { id: number; username: string; email: string } | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface AdminWalletsProps {
    transactions: Paginated<WalletTransactionRow>;
    type: string;
    search: string;
    stats: {
        totalUsers: number;
        totalBalance: string;
        totalTopups: string;
    };
}

const TYPE_CLASS: Record<TransactionType, string> = {
    topup: 'uap-tag-green',
    purchase: 'uap-tag-danger',
    refund: 'uap-tag-green',
    adjustment: 'uap-tag-warning',
};

const FILTERS = [
    { key: '', label: 'All' },
    { key: 'topup', label: 'Top Up' },
    { key: 'purchase', label: 'Purchase' },
    { key: 'refund', label: 'Refund' },
    { key: 'adjustment', label: 'Adjustment' },
];

function formatPrice(value: string | number) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

function isCredit(tx: WalletTransactionRow) {
    if (tx.type === 'adjustment') {
        return Number(tx.amount) >= 0;
    }

    return tx.type === 'topup' || tx.type === 'refund';
}

export default function AdminWallets({ transactions, type, search, stats }: AdminWalletsProps) {
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm<{ username: string; amount: number | ''; reason: string }>({
        username: '',
        amount: '',
        reason: '',
    });

    const filterBy = (key: string) => {
        router.get('/admin/wallets', { ...(key ? { type: key } : {}), ...(search ? { search } : {}) }, { preserveState: true });
    };

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/admin/wallets', { ...(type ? { type } : {}), search: (e.target as HTMLFormElement).search.value }, { preserveState: true });
    };

    const submitAdjust: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/wallets/adjust', { onSuccess: () => reset() });
    };

    return (
        <AdminLayout>
            <Head title="Admin Wallets" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-extrabold">Ucash Wallets</h1>
            </div>

            {flash?.status && (
                <div className="mb-6 p-4" style={{ background: 'rgba(46, 160, 67, 0.1)', border: '1px solid var(--uap-accent-green)' }}>
                    <span style={{ color: 'var(--uap-text-primary)' }}>{flash.status}</span>
                </div>
            )}

            <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="uap-card p-4 text-center">
                    <p className="text-2xl font-extrabold">{stats.totalUsers}</p>
                    <p className="mt-1 text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Users With Balance
                    </p>
                </div>
                <div className="uap-card p-4 text-center">
                    <p className="text-2xl font-extrabold">{formatPrice(stats.totalBalance)}</p>
                    <p className="mt-1 text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Total Circulating Balance
                    </p>
                </div>
                <div className="uap-card p-4 text-center">
                    <p className="text-2xl font-extrabold">{formatPrice(stats.totalTopups)}</p>
                    <p className="mt-1 text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Total Top Ups
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => filterBy(f.key)}
                                    className={`uap-tag ${type === f.key ? 'uap-tag-accent' : ''}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={submitSearch} className="flex gap-2">
                            <input
                                type="text"
                                name="search"
                                defaultValue={search}
                                placeholder="Search username or email"
                                className="p-2 text-sm"
                                style={{ background: 'var(--uap-bg-deep)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                            />
                            <button type="submit" className="uap-btn uap-btn-outline uap-btn-sm">
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="uap-card overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                                    <th className="px-4 py-3">Reference</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Balance After</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center" style={{ color: 'var(--uap-text-dim)' }}>
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                                {transactions.data.map((tx) => (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                            {tx.reference_no}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p>{tx.user?.username ?? 'Deleted user'}</p>
                                            <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                                {tx.user?.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`uap-tag ${TYPE_CLASS[tx.type]}`}>{tx.type}</span>
                                        </td>
                                        <td
                                            className="px-4 py-3 font-semibold"
                                            style={{ color: isCredit(tx) ? 'var(--uap-accent-green)' : 'var(--uap-accent-red)' }}
                                        >
                                            {isCredit(tx) ? '+' : '-'}
                                            {formatPrice(Math.abs(Number(tx.amount)))}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                            {formatPrice(tx.balance_after)}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                            {new Date(tx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {transactions.last_page > 1 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                            {transactions.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    className={`uap-tag ${link.active ? 'uap-tag-accent' : ''}`}
                                    style={!link.url ? { opacity: 0.4, cursor: 'default' } : undefined}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Manual adjustment */}
                <div className="uap-card h-fit p-6">
                    <h2 className="uap-section-title">Manual Balance Adjustment</h2>
                    <form onSubmit={submitAdjust} className="flex flex-col gap-3">
                        <div>
                            <label className="mb-1 block text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                Username
                            </label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                placeholder="e.g. shadowblade"
                                className="w-full p-3"
                                style={{ background: 'var(--uap-bg-deep)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                Amount (negative to debit)
                            </label>
                            <input
                                type="number"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="e.g. 50000 or -50000"
                                className="w-full p-3"
                                style={{ background: 'var(--uap-bg-deep)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                            />
                            {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                Reason
                            </label>
                            <textarea
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Why is this adjustment being made?"
                                rows={3}
                                className="w-full p-3"
                                style={{ background: 'var(--uap-bg-deep)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                            />
                            {errors.reason && <p className="mt-1 text-sm text-red-400">{errors.reason}</p>}
                        </div>
                        <button type="submit" disabled={processing} className="uap-btn uap-btn-primary w-full">
                            {processing ? 'Processing...' : 'Apply Adjustment'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
