import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface GameRow {
    id: number;
    title: string;
    genre: string | null;
    price: string;
    discount: number;
    is_free: boolean;
}

interface EditGame {
    id: number;
    title: string;
    description: string | null;
    genre: string | null;
    price: string;
    discount: number;
    is_free: boolean;
    release_date: string | null;
    developer: string | null;
    publisher: string | null;
    req_os: string | null;
    req_processor: string | null;
    req_memory: string | null;
    req_graphics: string | null;
    req_storage: string | null;
    image: string | null;
}

interface Screenshot {
    id: number;
    filename: string;
}

interface GamesProps {
    games: GameRow[];
    editGame: EditGame | null;
    editScreenshots: Screenshot[];
    saved: boolean;
}

function formatPrice(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

const inputStyle = {
    background: 'var(--uap-bg-deep)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

const labelStyle = { color: 'var(--uap-text-secondary)' };

export default function AdminGames({ games, editGame, editScreenshots, saved }: GamesProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: editGame?.title ?? '',
        description: editGame?.description ?? '',
        genre: editGame?.genre ?? '',
        price: editGame?.price ?? '0',
        discount: editGame?.discount ?? 0,
        is_free: editGame?.is_free ?? false,
        release_date: editGame?.release_date ?? '',
        developer: editGame?.developer ?? '',
        publisher: editGame?.publisher ?? '',
        req_os: editGame?.req_os ?? '',
        req_processor: editGame?.req_processor ?? '',
        req_memory: editGame?.req_memory ?? '',
        req_graphics: editGame?.req_graphics ?? '',
        req_storage: editGame?.req_storage ?? '',
        image: null as File | null,
        screenshots: [] as File[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = editGame ? `/admin/games/${editGame.id}` : '/admin/games';
        post(url, {
            forceFormData: true,
            onSuccess: () => reset('image', 'screenshots'),
        });
    };

    const deleteGame = (id: number) => {
        if (confirm('Hapus game ini?')) {
            router.post(`/admin/games/${id}/delete`);
        }
    };

    const deleteScreenshot = (imageId: number) => {
        if (confirm('Delete this screenshot?')) {
            router.post('/admin/games/screenshots/delete', { image_id: imageId, game_id: editGame?.id });
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Games" />

            <h1 className="mb-6 text-2xl font-extrabold">Games</h1>

            {saved && (
                <div
                    className="mb-4 p-3 text-sm"
                    style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)', color: 'var(--uap-accent-green)' }}
                >
                    Game updated successfully.
                </div>
            )}

            <div className="uap-card mb-6 p-6">
                <h2 className="uap-section-title">{editGame ? 'Edit Game' : 'Add New Game'}</h2>

                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Genre
                            </label>
                            <input
                                type="text"
                                value={data.genre}
                                onChange={(e) => setData('genre', e.target.value)}
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Price (Rp)
                            </label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={data.discount}
                                onChange={(e) => setData('discount', Number(e.target.value))}
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Release Date
                            </label>
                            <input
                                type="date"
                                value={data.release_date ?? ''}
                                onChange={(e) => setData('release_date', e.target.value)}
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Developer
                            </label>
                            <input
                                type="text"
                                value={data.developer}
                                onChange={(e) => setData('developer', e.target.value)}
                                placeholder="e.g. CD Projekt Red"
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Publisher
                            </label>
                            <input
                                type="text"
                                value={data.publisher}
                                onChange={(e) => setData('publisher', e.target.value)}
                                placeholder="e.g. CD Projekt"
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                OS
                            </label>
                            <input
                                type="text"
                                value={data.req_os}
                                onChange={(e) => setData('req_os', e.target.value)}
                                placeholder="Windows 10/11 64-bit"
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Processor
                            </label>
                            <input
                                type="text"
                                value={data.req_processor}
                                onChange={(e) => setData('req_processor', e.target.value)}
                                placeholder="Intel Core i5 / AMD Ryzen 5"
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Memory
                            </label>
                            <input
                                type="text"
                                value={data.req_memory}
                                onChange={(e) => setData('req_memory', e.target.value)}
                                placeholder="8 GB RAM"
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Graphics
                            </label>
                            <input
                                type="text"
                                value={data.req_graphics}
                                onChange={(e) => setData('req_graphics', e.target.value)}
                                placeholder="GTX 1060 / RX 580"
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Storage
                            </label>
                            <input
                                type="text"
                                value={data.req_storage}
                                onChange={(e) => setData('req_storage', e.target.value)}
                                placeholder="20 GB available"
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs" style={labelStyle}>
                                Game Image
                            </label>
                            {editGame?.image && (
                                <img src={`/uploads/games/${editGame.id}/${editGame.image}`} className="mb-2 h-24 w-full object-cover" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                style={inputStyle}
                                className="w-full px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" id="is_free" checked={data.is_free} onChange={(e) => setData('is_free', e.target.checked)} />
                            <label htmlFor="is_free" className="text-sm">
                                Free to Play
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="mb-1 block text-xs" style={labelStyle}>
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={6}
                            style={inputStyle}
                            className="w-full px-3 py-2 text-sm outline-none"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="mb-1 block text-xs" style={labelStyle}>
                            Screenshots (multiple files allowed)
                        </label>
                        {editScreenshots.length > 0 && (
                            <div className="mb-3 grid grid-cols-4 gap-2">
                                {editScreenshots.map((ss) => (
                                    <div key={ss.id} className="relative">
                                        <img
                                            src={`/uploads/games/${editGame?.id}/screenshots/${ss.filename}`}
                                            style={{ border: '1px solid var(--uap-border)' }}
                                            className="h-22 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => deleteScreenshot(ss.id)}
                                            style={{ background: 'rgba(0,0,0,0.7)' }}
                                            className="absolute top-1 right-1 px-1.5 text-xs text-white"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setData('screenshots', Array.from(e.target.files ?? []))}
                            style={inputStyle}
                            className="w-full px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button type="submit" disabled={processing} className="uap-btn uap-btn-primary" style={{ opacity: processing ? 0.5 : 1 }}>
                            {editGame ? 'Update Game' : 'Add Game'}
                        </button>
                        {editGame && (
                            <Link href="/admin/games" className="uap-btn uap-btn-outline">
                                Cancel
                            </Link>
                        )}
                    </div>
                </form>
            </div>

            <div className="uap-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Genre</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3">Free</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game) => (
                            <tr key={game.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                <td className="px-4 py-3">{game.title}</td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {game.genre}
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {formatPrice(Number(game.price))}
                                </td>
                                <td className="px-4 py-3">
                                    {game.discount > 0 ? (
                                        <span className="uap-tag uap-tag-green">-{game.discount}%</span>
                                    ) : (
                                        <span style={{ color: 'var(--uap-text-dim)' }}>—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {game.is_free ? (
                                        <span className="uap-tag uap-tag-danger">Free</span>
                                    ) : (
                                        <span style={{ color: 'var(--uap-text-dim)' }}>—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <Link href={`/admin/games?edit=${game.id}`} className="uap-btn uap-btn-outline uap-btn-sm">
                                            Edit
                                        </Link>
                                        <button onClick={() => deleteGame(game.id)} className="uap-btn uap-btn-danger uap-btn-sm">
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
