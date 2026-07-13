<?php

namespace Database\Seeders;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Database\Seeder;

class FriendSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('username', UserSeeder::usernames())->get();

        if ($users->count() < 2) {
            return;
        }

        foreach ($users as $user) {
            $candidates = $users->except($user->id);
            $friendCount = rand(5, 12);
            $friends = $candidates->random(min($friendCount, $candidates->count()));

            foreach ($friends as $friend) {
                Friend::firstOrCreate([
                    'user_id' => $user->id,
                    'friend_id' => $friend->id,
                ], [
                    'status' => 'accepted',
                ]);

                Friend::firstOrCreate([
                    'user_id' => $friend->id,
                    'friend_id' => $user->id,
                ], [
                    'status' => 'accepted',
                ]);
            }
        }
    }
}
