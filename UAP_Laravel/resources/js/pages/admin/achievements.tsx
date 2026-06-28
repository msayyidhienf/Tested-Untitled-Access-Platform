import AdminLayout from '@/layouts/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface AchievementRow {
    id: number;
    name: string;
    description: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    users_count: number;
}

interface AchievementsProps {
    achievements: AchievementRow[];
    editAchievement: AchievementRow | null;
}

const RARITY_CLASS: Record<string, string> = {
    Common: 'uap-tag-green',
    Rare: 'uap-tag',
    Epic: 'uap-tag-accent',
    Legendary: 'uap-tag-warning',
};

const inputStyle = {
    background: 'var(--uap-bg-deep)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

function AchievementForm({ editAchievement, onDone }: { editAchievement: AchievementRow | null; onDone: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: editAchievement?.name ?? '',
        description: editAchievement?.description ?? '',
        rarity: editAchievement?.rarity ?? 'Common',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = editAchievement ? `/admin/achievements/${editAchievement.id}` : '/admin/achievements';
        post(url, {
            onSuccess: () => {
                reset();
                onDone();
            },
        });
    };

    return (
        <form onSubmit={submit} className="uap-card mb-6 p-6">
            <h2 className="uap-section-title">{editAchievement ? 'Edit Achievement' : 'Add Achievement'}</h2>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                        Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        style={inputStyle}
                        className="w-full px-3 py-2 text-sm outline-none"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                            {errors.name}
                        </p>
                    )}
                </div>
                <div>
                    <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                        Rarity
                    </label>
                    <select
                        value={data.rarity}
                        onChange={(e) => setData('rarity', e.target.value as AchievementRow['rarity'])}
                        style={inputStyle}
                        className="w-full px-3 py-2 text-sm outline-none"
                    >
                        {['Common', 'Rare', 'Epic', 'Legendary'].map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end gap-2">
                    <button type="submit" disabled={processing} className="uap-btn uap-btn-primary">
                        {editAchievement ? 'Update' : 'Add'}
                    </button>
                    {editAchievement && (
                        <button type="button" onClick={onDone} className="uap-btn uap-btn-outline">
                            Cancel
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                    Description
                </label>
                <input
                    type="text"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    required
                    style={inputStyle}
                    className="w-full px-3 py-2 text-sm outline-none"
                />
                {errors.description && (
                    <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                        {errors.description}
                    </p>
                )}
            </div>
        </form>
    );
}

export default function AdminAchievements({ achievements, editAchievement }: AchievementsProps) {
    const deleteAchievement = (achievement: AchievementRow) => {
        if (confirm(`Delete achievement "${achievement.name}"?`)) {
            router.post(`/admin/achievements/${achievement.id}/delete`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Achievements" />

            <h1 className="mb-6 text-2xl font-extrabold">Achievements</h1>

            <AchievementForm
                key={editAchievement?.id ?? 'new'}
                editAchievement={editAchievement}
                onDone={() => router.get('/admin/achievements')}
            />

            <div className="uap-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Rarity</th>
                            <th className="px-4 py-3">Unlocked By</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {achievements.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center" style={{ color: 'var(--uap-text-dim)' }}>
                                    No achievements yet.
                                </td>
                            </tr>
                        )}
                        {achievements.map((ach) => (
                            <tr key={ach.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                <td className="px-4 py-3 font-medium">{ach.name}</td>
                                <td className="max-w-[280px] truncate px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {ach.description}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`uap-tag ${RARITY_CLASS[ach.rarity]}`}>{ach.rarity}</span>
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {ach.users_count} user{ach.users_count !== 1 ? 's' : ''}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.get('/admin/achievements', { edit: ach.id })}
                                            className="uap-btn uap-btn-outline uap-btn-sm"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => deleteAchievement(ach)} className="uap-btn uap-btn-danger uap-btn-sm">
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
