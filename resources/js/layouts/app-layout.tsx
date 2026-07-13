import SiteLayout from '@/components/site-layout';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <SiteLayout>
            <div className="px-6 py-8">{children}</div>
        </SiteLayout>
    );
}
