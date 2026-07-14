import { Link } from '@inertiajs/react';

const FOOTER_COLUMNS = [
    {
        title: 'Store',
        links: [
            { label: 'Featured', href: '/store' },
            { label: 'New Releases', href: '/store?filter=new' },
            { label: 'On Sale', href: '/store?filter=sale' },
            { label: 'Free to Play', href: '/store?filter=free' },
        ],
    },
    {
        title: 'Community',
        links: [
            { label: 'Feed', href: '/community' },
            { label: 'Reviews', href: '/community/reviews' },
            { label: 'Guides', href: '/community/guides' },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Help Center', href: '/support' },
            { label: 'FAQ', href: '/support/faq' },
            { label: 'Refund Policy', href: '/support/refund' },
            { label: 'Contact Us', href: '/support/contact' },
        ],
    },
    {
        title: 'Account',
        links: [
            { label: 'Library', href: '/library' },
            { label: 'Ucash Wallet', href: '/wallet' },
            { label: 'Profile', href: '/profile' },
        ],
    },
];

export default function SiteFooter() {
    return (
        <footer className="uap-footer">
            <div className="uap-footer-main">
                <div className="uap-footer-brand">
                    <img src="/images/logo.png" alt="UAP" className="uap-footer-logo" />
                    <p className="uap-footer-tagline">
                        Untitled Access Platform — your gateway to games. Browse, play, and connect with the community.
                    </p>
                </div>

                <div className="uap-footer-columns">
                    {FOOTER_COLUMNS.map((col) => (
                        <div key={col.title} className="uap-footer-col">
                            <p className="uap-footer-col-title">{col.title}</p>
                            {col.links.map((link) => (
                                <Link key={link.href} href={link.href} className="uap-footer-link">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="uap-footer-bottom">
                <span>© {new Date().getFullYear()} UAP — Untitled Access Platform. All rights reserved.</span>
                <span className="uap-footer-note">All game titles, artwork, and trademarks are property of their respective owners.</span>
            </div>
        </footer>
    );
}
