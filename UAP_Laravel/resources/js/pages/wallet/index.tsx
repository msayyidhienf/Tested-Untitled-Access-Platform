import SiteLayout from '@/components/site-layout';
import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface WalletTransaction {
    id: number;
    type: 'topup' | 'purchase' | 'refund';
    amount: string;
    balance_after: string;
    description: string | null;
    created_at: string;
}

interface WalletIndexProps {
    balance: string;
    presets: number[];
    transactions: WalletTransaction[];
}

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

const TYPE_LABEL: Record<WalletTransaction['type'], string> = {
    topup: 'Top Up',
    purchase: 'Purchase',
    refund: 'Refund',
};

export default function WalletIndex({ balance, presets, transactions }: WalletIndexProps) {
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors } = useForm<{ amount: number | '' }>({ amount: '' });

    const submitTopUp: FormEventHandler = (e) => {
        e.preventDefault();
        post('/wallet/topup');
    };

    return (
        <>
            <Head title="Ucash Wallet" />
            <SiteLayout>
                <div className="px-6 py-8">
                    <h1 className="mb-6 text-2xl font-extrabold">Ucash Wallet</h1>

                    {flash?.status && (
                        <div className="mb-6 p-4" style={{ background: 'rgba(46, 160, 67, 0.1)', border: '1px solid var(--uap-accent-green)' }}>
                            <span style={{ color: 'var(--uap-text-primary)' }}>{flash.status}</span>
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
                                            onClick={() => setData('amount', preset)}
                                            className="uap-btn uap-btn-outline"
                                            style={
                                                data.amount === preset
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
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="Ucash amount"
                                            className="w-full p-3"
                                            style={{
                                                background: 'var(--uap-bg-deep)',
                                                border: '1px solid var(--uap-border)',
                                                color: 'var(--uap-text-primary)',
                                            }}
                                        />
                                        {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
                                    </div>
                                    <button type="submit" disabled={processing || !data.amount} className="uap-btn uap-btn-primary w-full">
                                        {processing ? 'Processing...' : 'Top Up Now'}
                                    </button>
                                </form>
                            </div>

                            {/* Transaction history */}
                            <div className="uap-card p-6">
                                <h2 className="uap-section-title">Transaction History</h2>

                                {transactions.length === 0 ? (
                                    <p style={{ color: 'var(--uap-text-secondary)' }}>No transactions yet.</p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {transactions.map((tx) => (
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
                                                        {formatDate(tx.created_at)}
                                                    </p>
                                                </div>
                                                <span
                                                    className="font-bold"
                                                    style={{ color: tx.type === 'topup' ? 'var(--uap-accent-green)' : 'var(--uap-accent-red)' }}
                                                >
                                                    {tx.type === 'topup' ? '+' : '-'}
                                                    {formatUcash(tx.amount)}
                                                </span>
                                            </div>
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
