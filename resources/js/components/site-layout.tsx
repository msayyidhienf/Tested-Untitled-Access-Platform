import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import SiteSidebar from '@/components/site-sidebar';
import type { ReactNode } from 'react';

type Section = 'store' | 'library' | 'community' | 'support';

export default function SiteLayout({ section, children }: { section?: Section; children: ReactNode }) {
    return (
        <div className="uap-page">
            <SiteHeader />
            <div className="flex">
                <SiteSidebar section={section} />
                <main className="min-w-0 flex-1">{children}</main>
            </div>
            <SiteFooter />
        </div>
    );
}
