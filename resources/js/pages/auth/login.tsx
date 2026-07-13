import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const inputStyle = {
    background: 'var(--uap-bg-card)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

const labelStyle = { color: 'var(--uap-text-secondary)' };

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium" style={labelStyle}>
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            style={inputStyle}
                            className="w-full px-3 py-2 text-sm outline-none"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <label htmlFor="password" className="text-sm font-medium" style={labelStyle}>
                                Password
                            </label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-[var(--uap-accent)]" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            style={inputStyle}
                            className="w-full px-3 py-2 text-sm outline-none"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label htmlFor="remember" className="text-sm" style={labelStyle}>
                            Remember me
                        </label>
                    </div>

                    <button type="submit" className="uap-btn uap-btn-primary mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </button>
                </div>

                <div className="text-center text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                    Don't have an account?{' '}
                    <TextLink href={route('register')} className="text-[var(--uap-accent)]" tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium" style={{ color: 'var(--uap-accent-green)' }}>
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
