<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\Friend;
use App\Models\Guide;
use App\Models\Library;
use App\Models\Notification;
use App\Models\OrderItem;
use App\Models\Post;
use App\Models\Review;
use App\Models\User;
use App\Models\UserAchievement;

class AchievementService
{
    /**
     * Re-evaluate every achievement of the given type for this user and
     * unlock any whose criteria are now met.
     */
    public static function check(User $user, string $type): void
    {
        $achievements = Achievement::where('type', $type)->get();

        if ($achievements->isEmpty()) {
            return;
        }

        $unlockedIds = UserAchievement::where('user_id', $user->id)
            ->whereIn('achievement_id', $achievements->pluck('id'))
            ->pluck('achievement_id')
            ->all();

        $value = self::currentValue($user, $type);

        foreach ($achievements as $achievement) {
            if (in_array($achievement->id, $unlockedIds, true)) {
                continue;
            }

            $earned = $type === 'early_adopter'
                ? $user->id <= $achievement->threshold
                : $value >= $achievement->threshold;

            if ($earned) {
                self::unlock($user, $achievement);
            }
        }
    }

    private static function currentValue(User $user, string $type): int
    {
        return match ($type) {
            'games_owned' => Library::where('user_id', $user->id)->count(),
            'hours_played' => (int) Library::where('user_id', $user->id)->sum('hours_played'),
            'reviews_written' => Review::where('user_id', $user->id)->count(),
            'posts_written' => Post::where('user_id', $user->id)->count(),
            'guides_written' => Guide::where('user_id', $user->id)->count(),
            'friends_count' => Friend::where('user_id', $user->id)->where('status', 'accepted')->count(),
            'sale_purchase' => OrderItem::whereHas('order', fn ($q) => $q->where('user_id', $user->id)->where('status', 'paid'))
                ->whereHas('game', fn ($q) => $q->where('discount', '>', 0))
                ->exists() ? 1 : 0,
            'free_game_added' => Library::where('user_id', $user->id)
                ->whereHas('game', fn ($q) => $q->where('is_free', true))
                ->exists() ? 1 : 0,
            default => 0,
        };
    }

    private static function unlock(User $user, Achievement $achievement): void
    {
        UserAchievement::create([
            'user_id' => $user->id,
            'achievement_id' => $achievement->id,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'achievement',
            'title' => 'Achievement Unlocked',
            'message' => "You unlocked \"{$achievement->name}\" — {$achievement->description}",
            'link' => '/profile',
        ]);
    }
}
