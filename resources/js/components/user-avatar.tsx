interface UserAvatarProps {
    user: { id: number; username: string; avatar?: string | null };
    size?: number;
    className?: string;
}

export default function UserAvatar({ user, size = 28, className = '' }: UserAvatarProps) {
    if (user.avatar) {
        return (
            <img
                src={`/uploads/avatars/${user.id}/${user.avatar}`}
                alt={user.username}
                style={{ width: size, height: size }}
                className={`flex-shrink-0 object-cover ${className}`}
            />
        );
    }

    return (
        <div
            style={{ width: size, height: size, background: 'var(--uap-bg-hover)', fontSize: Math.max(9, size * 0.38) }}
            className={`flex flex-shrink-0 items-center justify-center font-bold ${className}`}
        >
            {user.username.slice(0, 2).toUpperCase()}
        </div>
    );
}
