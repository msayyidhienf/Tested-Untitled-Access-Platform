import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        username: auth.user!.username,
        email: auth.user!.email,
        bio: auth.user!.bio ?? '',
        country: auth.user!.country ?? '',
        avatar: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your username and account details" />

                    <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                        <div className="grid gap-2">
                            <Label htmlFor="avatar">Avatar</Label>

                            {auth.user!.avatar && (
                                <img
                                    src={`/uploads/avatars/${auth.user!.id}/${auth.user!.avatar}`}
                                    alt="Avatar"
                                    className="h-20 w-20 rounded-full border-2 border-red-600 object-cover"
                                />
                            )}

                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full"
                                onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                            />

                            <InputError className="mt-2" message={errors.avatar} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>

                            <Input
                                id="username"
                                className="mt-1 block w-full"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Username"
                            />

                            <InputError className="mt-2" message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>

                            <Input
                                id="bio"
                                className="mt-1 block w-full"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Tell us about yourself"
                            />

                            <InputError className="mt-2" message={errors.bio} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>

                            <Input
                                id="country"
                                className="mt-1 block w-full"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                placeholder="Country"
                            />

                            <InputError className="mt-2" message={errors.country} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
