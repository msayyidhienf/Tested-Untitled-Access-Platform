import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

type Section = 'store' | 'library' | 'community' | 'support';

const GENRES = ['Action', 'RPG', 'Strategy', 'Simulation', 'Indie', 'Multiplayer'];

function useQueryParams() {
    const url = usePage().url;
    const queryString = url.includes('?') ? url.slice(url.indexOf('?')) : '';
    return new URLSearchParams(queryString);
}

function SidebarItem({ href, active, badge, children }: { href: string; active: boolean; badge?: string; children: ReactNode }) {
    return (
        <Link href={href} className={`uap-sidebar-item ${active ? 'active' : ''}`}>
            {children}
            {badge && <span className="uap-sidebar-badge">{badge}</span>}
        </Link>
    );
}

function StoreSection() {
    const params = useQueryParams();
    const filter = params.get('filter') ?? '';
    const genre = params.get('genre') ?? '';

    return (
        <>
            <div className="uap-sidebar-section">
                <span className="uap-sidebar-label">Discover</span>
                <SidebarItem href="/store" active={!filter && !genre}>
                    Featured
                </SidebarItem>
                <SidebarItem href="/store?filter=new" active={filter === 'new'}>
                    New Releases
                </SidebarItem>
                <SidebarItem href="/store?filter=sale" active={filter === 'sale'} badge="HOT">
                    On Sale
                </SidebarItem>
                <SidebarItem href="/store?filter=free" active={filter === 'free'}>
                    Free to Play
                </SidebarItem>
            </div>
            <div className="uap-sidebar-section">
                <span className="uap-sidebar-label">Sort by Genre</span>
                {GENRES.map((g) => (
                    <SidebarItem key={g} href={`/store?genre=${encodeURIComponent(g)}`} active={genre === g}>
                        {g}
                    </SidebarItem>
                ))}
            </div>
        </>
    );
}

function LibrarySection() {
    const params = useQueryParams();
    const tab = params.get('tab') ?? 'all';

    return (
        <div className="uap-sidebar-section">
            <span className="uap-sidebar-label">My Library</span>
            <SidebarItem href="/library" active={tab === 'all'}>
                All Games
            </SidebarItem>
            <SidebarItem href="/library?tab=favorites" active={tab === 'favorites'}>
                Favorites
            </SidebarItem>
            <SidebarItem href="/library?tab=installed" active={tab === 'installed'}>
                Installed
            </SidebarItem>
            <SidebarItem href="/library?tab=not-installed" active={tab === 'not-installed'}>
                Not Installed
            </SidebarItem>
        </div>
    );
}

function CommunitySection() {
    const url = usePage().url;

    return (
        <div className="uap-sidebar-section">
            <span className="uap-sidebar-label">Community</span>
            <SidebarItem href="/community" active={url === '/community'}>
                Forum
            </SidebarItem>
            <SidebarItem href="/community/reviews" active={url.startsWith('/community/reviews')}>
                Reviews
            </SidebarItem>
            <SidebarItem href="/community/guides" active={url.startsWith('/community/guides')}>
                Guides
            </SidebarItem>
        </div>
    );
}

function SupportSection() {
    const url = usePage().url;

    return (
        <div className="uap-sidebar-section">
            <span className="uap-sidebar-label">Support</span>
            <SidebarItem href="/support" active={url === '/support'}>
                Help Center
            </SidebarItem>
            <SidebarItem href="/support/faq" active={url.startsWith('/support/faq')}>
                FAQ
            </SidebarItem>
            <SidebarItem href="/support/contact" active={url.startsWith('/support/contact')}>
                Contact Us
            </SidebarItem>
            <SidebarItem href="/support/refund" active={url.startsWith('/support/refund')}>
                Refund Policy
            </SidebarItem>
        </div>
    );
}

export default function SiteSidebar({ section }: { section?: Section }) {
    const { auth, cartCount } = usePage<SharedData>().props;
    const url = usePage().url;

    return (
        <aside className="uap-sidebar">
            {section === 'store' && <StoreSection />}
            {section === 'library' && <LibrarySection />}
            {section === 'community' && <CommunitySection />}
            {section === 'support' && <SupportSection />}

            <div className="uap-sidebar-section">
                <span className="uap-sidebar-label">Your Stuff</span>
                <SidebarItem href="/library" active={url.startsWith('/library')}>
                    Library
                </SidebarItem>
                <SidebarItem href="/cart" active={url.startsWith('/cart')} badge={cartCount > 0 ? String(cartCount) : undefined}>
                    Cart
                </SidebarItem>
                {auth.user ? (
                    <SidebarItem href="/profile" active={url.startsWith('/profile')}>
                        Profile
                    </SidebarItem>
                ) : (
                    <>
                        <SidebarItem href="/login" active={url.startsWith('/login')}>
                            Login
                        </SidebarItem>
                        <SidebarItem href="/register" active={url.startsWith('/register')}>
                            Register
                        </SidebarItem>
                    </>
                )}
            </div>

            {auth.user && (
                <div className="uap-sidebar-footer">
                    <Link href="/profile" className="uap-sidebar-user-row">
                        {auth.user.avatar ? (
                            <img
                                src={`/uploads/avatars/${auth.user.id}/${auth.user.avatar}`}
                                alt={auth.user.username}
                                className="uap-sidebar-avatar"
                            />
                        ) : (
                            <span className="uap-sidebar-avatar">{auth.user.username.slice(0, 2).toUpperCase()}</span>
                        )}
                        <div className="overflow-hidden">
                            <div className="uap-sidebar-username">{auth.user.username}</div>
                            <div className="uap-sidebar-status">
                                <span className="uap-sidebar-dot" />
                                Online
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </aside>
    );
}
