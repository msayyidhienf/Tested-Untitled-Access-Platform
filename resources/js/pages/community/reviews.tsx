import CommunitySidebar, { CommunityTabs } from '@/components/community-sidebar';
import SiteLayout from '@/components/site-layout';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface ReviewItem {
    id: number;
    rating: number;
    content: string;
    created_at: string;
    user: { id: number; username: string; avatar: string | null };
    game: { id: number; title: string };
}

interface UserGameEntry {
    game_id: number;
    game: { id: number; title: string };
}

interface ReviewsProps {
    reviews: ReviewItem[];
    userGames: UserGameEntry[];
    sidebar: any;
}

const inputStyle = {
    background: 'var(--uap-bg-deep)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

function ratingTagClass(rating: number) {
    if (rating >= 4) return 'uap-tag uap-tag-green';
    if (rating >= 3) return 'uap-tag uap-tag-warning';
    return 'uap-tag uap-tag-danger';
}

export default function CommunityReviews({ reviews, userGames, sidebar }: ReviewsProps) {
    const { auth } = usePage<SharedData>().props;
    const [gameId, setGameId] = useState(userGames[0]?.game_id ?? '');
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');

    const submitReview: FormEventHandler = (e) => {
        e.preventDefault();
        if (!gameId) return;
        router.post(
            '/community/reviews',
            { game_id: gameId, rating, content },
            {
                onSuccess: () => setContent(''),
            },
        );
    };

    return (
        <>
            <Head title="Community Reviews" />
            <SiteLayout section="community">
            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold">Community</h1>
                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        Connect, share, and discuss with the UAP community.
                    </p>
                </div>

                <div className="flex gap-6">
                    <div className="flex-1">
                        <CommunityTabs active="reviews" />

                        {auth.user && userGames.length > 0 && (
                            <form onSubmit={submitReview} className="uap-card mb-6 p-4">
                                <div className="mb-2 flex gap-2">
                                    <select
                                        value={gameId}
                                        onChange={(e) => setGameId(e.target.value)}
                                        style={inputStyle}
                                        className="flex-1 px-2 py-1.5 text-sm"
                                    >
                                        {userGames.map((entry) => (
                                            <option key={entry.game_id} value={entry.game_id}>
                                                {entry.game.title}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        style={inputStyle}
                                        className="px-2 py-1.5 text-sm"
                                    >
                                        {[5, 4, 3, 2, 1].map((r) => (
                                            <option key={r} value={r}>
                                                {r} / 5
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your review..."
                                    required
                                    rows={3}
                                    style={inputStyle}
                                    className="mb-2 w-full px-3 py-2 text-sm outline-none"
                                />
                                <button type="submit" className="uap-btn uap-btn-primary uap-btn-sm">
                                    Submit Review
                                </button>
                            </form>
                        )}

                        <div className="flex flex-col gap-3">
                            {reviews.length === 0 && (
                                <div className="uap-card p-12 text-center text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                    No reviews yet.
                                </div>
                            )}
                            {reviews.map((review) => (
                                <div key={review.id} className="uap-card p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="flex h-7 w-7 items-center justify-center text-xs font-bold"
                                                style={{ background: 'var(--uap-bg-hover)' }}
                                            >
                                                {review.user.username.slice(0, 2).toUpperCase()}
                                            </div>
                                            <Link href={`/profile/${review.user.id}`} className="text-sm font-semibold hover:underline">
                                                {review.user.username}
                                            </Link>
                                            <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                                on {review.game.title}
                                            </span>
                                        </div>
                                        <span className={ratingTagClass(review.rating)}>{review.rating}/5</span>
                                    </div>
                                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        {review.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <CommunitySidebar sidebar={sidebar} />
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
