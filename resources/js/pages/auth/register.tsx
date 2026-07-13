import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const inputStyle = {
    background: 'var(--uap-bg-card)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

const labelStyle = { color: 'var(--uap-text-secondary)' };

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <label htmlFor="username" className="text-sm font-medium" style={labelStyle}>
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            disabled={processing}
                            placeholder="Username"
                            style={inputStyle}
                            className="w-full px-3 py-2 text-sm outline-none"
                        />
                        <InputError message={errors.username} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium" style={labelStyle}>
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                            style={inputStyle}
                            className="w-full px-3 py-2 text-sm outline-none"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="password" className="text-sm font-medium" style={labelStyle}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                            style={inputStyle}
                            className="w-full px-3 py-2 text-sm outline-none"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="password_confirmation" className="text-sm font-medium" style={labelStyle}>
                            Confirm password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                            style={inputStyle}
                            className="w-full px-3 py-2 text-sm outline-none"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <button type="submit" className="uap-btn uap-btn-primary mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </button>
                </div>

                <div className="text-center text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                    Already have an account?{' '}
                    <TextLink href={route('login')} className="text-[var(--uap-accent)]" tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
