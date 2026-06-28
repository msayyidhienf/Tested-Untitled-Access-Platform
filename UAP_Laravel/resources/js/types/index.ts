import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface AppNotification {
    id: number;
    type: string;
    title: string;
    message: string | null;
    link: string | null;
    read_at: string | null;
    created_at: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    cartCount: number;
    ucashBalance: string | null;
    notifications: AppNotification[];
    unreadNotificationCount: number;
    flash: { status?: string | null; error?: string | null };
    [key: string]: unknown;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatar: string | null;
    banner: string | null;
    bio: string | null;
    country: string | null;
    role: 'user' | 'admin';
    created_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Game {
    id: number;
    title: string;
    description: string | null;
    genre: string | null;
    price: string;
    discount: number;
    image: string | null;
    is_free: boolean;
    release_date: string | null;
    developer: string | null;
    publisher: string | null;
    [key: string]: unknown;
}
