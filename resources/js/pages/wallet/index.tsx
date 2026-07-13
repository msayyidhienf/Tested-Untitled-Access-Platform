import SiteLayout from '@/components/site-layout';
import { requestSnapToken } from '@/lib/midtrans';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type TransactionType = 'topup' | 'purchase' | 'refund' | 'adjustment';

interface WalletTransaction {
    id: number;
    reference_no: string;
    type: TransactionType;
    amount: string;
    balance_after: string;
    description: string | null;
    created_at: string;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface WalletIndexProps {
    balance: string;
    presets: number[];
    type: string;
    transactions: Paginated<WalletTransaction>;
}

const CREDIT_TYPES: TransactionType[] = ['topup', 'refund'];

const FILTERS: { key: string; label: string }[] = [
    { key: '', label: 'All' },
    { key: 'topup', label: 'Top Up' },
    { key: 'purchase', label: 'Purchase' },
    { key: 'refund', label: 'Refund' },
    { key: 'adjustment', label: 'Adjustment' },
];

function formatUcash(value: string | number) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

function formatDate(value: string) {
    return new Date(value).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const TYPE_LABEL: Record<TransactionType, string> = {
    topup: 'Top Up',
    purchase: 'Purchase',
    refund: 'Refund',
    adjustment: 'Adjustment',
};

function isCredit(tx: WalletTransaction) {
    if (tx.type === 'adjustment') {
        return Number(tx.amount) >= 0;
    }

    return CREDIT_TYPES.includes(tx.type);
}

export default function WalletIndex({ balance, presets, type, transactions }: WalletIndexProps) {
    const { flash } = usePage<SharedData>().props;
    const [amount, setAmount] = useState<number | ''>('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const submitTopUp: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!amount) {
            return;
        }

        setProcessing(true);
        setError(null);
        setStatus(null);

        try {
            const snapToken = await requestSnapToken(Number(amount));

            window.snap.pay(snapToken, {
                onSuccess: () => {
                    setStatus('Payment successful! Your Ucash balance will update shortly.');
                    setAmount('');
                    setTimeout(() => router.reload({ only: ['balance', 'transactions'] }), 1500);
                },
                onPending: () => {
                    setStatus('Payment pending. Your balance will update once payment is confirmed.');
                },
                onError: () => {
                    setError('Payment failed. Please try again.');
                },
                onClose: () => {
                    setProcessing(false);
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start payment.');
        } finally {
            setProcessing(false);
        }
    };

    const filterBy = (key: string) => {
        router.get('/wallet', key ? { type: key } : {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Ucash Wallet" />
            <SiteLayout>
                <div className="px-6 py-8">
                    <h1 className="mb-6 text-2xl font-extrabold">Ucash Wallet</h1>

                    {(flash?.status || status) && (
                        <div className="mb-6 p-4" style={{ background: 'rgba(46, 160, 67, 0.1)', border: '1px solid var(--uap-accent-green)' }}>
                            <span style={{ color: 'var(--uap-text-primary)' }}>{status ?? flash?.status}</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4" style={{ background: 'rgba(248, 81, 73, 0.1)', border: '1px solid var(--uap-accent-red)' }}>
                            <span style={{ color: 'var(--uap-text-primary)' }}>{error}</span>
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        <div className="flex flex-col gap-6">
                            {/* Top up */}
                            <div className="uap-card p-6">
                                <h2 className="uap-section-title">Top Up Ucash</h2>

                                <div className="mb-4 grid grid-cols-3 gap-3">
                                    {presets.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset)}
                                            className="uap-btn uap-btn-outline"
                                            style={
                                                amount === preset
                                                    ? { borderColor: 'var(--uap-accent)', color: 'var(--uap-text-primary)' }
                                                    : undefined
                                            }
                                        >
                                            {formatUcash(preset)}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={submitTopUp} className="flex flex-col gap-3">
                                    <div>
                                        <label className="mb-1 block text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                            Or enter a custom amount
                                        </label>
                                        <input
                                            type="number"
                                            min={1000}
                                            max={10000000}
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="Ucash amount"
                                            className="w-full p-3"
                                            style={{
                                                background: 'var(--uap-bg-deep)',
                                                border: '1px solid var(--uap-border)',
                                                color: 'var(--uap-text-primary)',
                                            }}
                                        />
                                    </div>
                                    <button type="submit" disabled={processing || !amount} className="uap-btn uap-btn-primary w-full">
                                        {processing ? 'Processing...' : 'Top Up Now'}
                                    </button>
                                </form>
                            </div>

                            {/* Transaction history */}
                            <div className="uap-card p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="uap-section-title mb-0">Transaction History</h2>
                                </div>

                                <div className="mb-4 flex flex-wrap gap-2">
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

                                {transactions.data.length === 0 ? (
                                    <p style={{ color: 'var(--uap-text-secondary)' }}>No transactions yet.</p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {transactions.data.map((tx) => (
                                            <div
                                                key={tx.id}
                                                className="flex items-center justify-between p-3"
                                                style={{ borderBottom: '1px solid var(--uap-border)' }}
                                            >
                                                <div>
                                                    <p className="font-semibold" style={{ color: 'var(--uap-text-primary)' }}>
                                                        {tx.description ?? TYPE_LABEL[tx.type]}
                                                    </p>
                                                    <p className="text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                                                        {formatDate(tx.created_at)} · {tx.reference_no}
                                                    </p>
                                                </div>
                                                <span
                                                    className="font-bold"
                                                    style={{ color: isCredit(tx) ? 'var(--uap-accent-green)' : 'var(--uap-accent-red)' }}
                                                >
                                                    {isCredit(tx) ? '+' : '-'}
                                                    {formatUcash(Math.abs(Number(tx.amount)))}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

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
                        </div>

                        {/* Balance card */}
                        <div className="uap-card p-6">
                            <h2 className="uap-section-title">Ucash Balance</h2>
                            <p className="text-3xl font-extrabold" style={{ color: 'var(--uap-accent)' }}>
                                {formatUcash(balance)}
                            </p>
                        </div>
                    </div>
                </div>
            </SiteLayout>
        </>
    );
}
