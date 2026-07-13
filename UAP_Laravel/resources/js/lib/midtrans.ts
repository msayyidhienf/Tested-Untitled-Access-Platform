declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options?: {
                    onSuccess?: (result: unknown) => void;
                    onPending?: (result: unknown) => void;
                    onError?: (result: unknown) => void;
                    onClose?: () => void;
                },
            ) => void;
        };
    }
}

function getXsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export async function requestSnapToken(amount: number): Promise<string> {
    const response = await fetch('/wallet/topup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? body?.errors?.amount?.[0] ?? 'Failed to start payment.');
    }

    const data = await response.json();

    return data.snap_token;
}

export {};
