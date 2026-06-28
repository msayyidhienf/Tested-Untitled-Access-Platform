import CommunitySidebar, { CommunityTabs } from '@/components/community-sidebar';
import SiteLayout from '@/components/site-layout';
import { Head, Link } from '@inertiajs/react';

interface GuideItem {
    id: number;
    title: string;
    content: string;
    views: number;
    user: { username: string };
    game: { id: number; title: string };
}

interface GuidesProps {
    guides: GuideItem[];
    sidebar: any;
}

export default function CommunityGuides({ guides, sidebar }: GuidesProps) {
    return (
        <>
            <Head title="Community Guides" />
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
                        <CommunityTabs active="guides" />

                        <div className="flex flex-col gap-3">
                            {guides.length === 0 && (
                                <div className="uap-card p-12 text-center text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                    No guides yet.
                                </div>
                            )}
                            {guides.map((guide) => (
                                <Link key={guide.id} href={`/game/${guide.game.id}`} className="uap-card block p-4">
                                    <div className="mb-1 flex items-center justify-between">
                                        <h3 className="font-semibold">{guide.title}</h3>
                                        <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                            {guide.views} views
                                        </span>
                                    </div>
                                    <p className="mb-2 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        by {guide.user.username} · for {guide.game.title}
                                    </p>
                                    <p className="line-clamp-2 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        {guide.content}
                                    </p>
                                </Link>
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
