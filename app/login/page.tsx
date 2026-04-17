'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/',
    });

    setLoading(false);

    if (result?.error) {
      setError('Unable to sign in. Please check your email and password.');
      return;
    }

    router.push('/');
  };

  return (
    <main className="main">
      <section className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="logo" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>ROAD2AMILLI</h1>
          <p style={{ color: '#a0b0cc', fontSize: '1.1rem' }}>Sign in or sign up with email to access premium predictions.</p>
        </div>

        {status === 'loading' ? (
          <p className="status">Loading session…</p>
        ) : session ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem' }}>Signed in as <strong>{session.user?.name ?? session.user?.email}</strong></p>
            <button type="button" onClick={() => signOut()} style={{ width: '100%', padding: '1rem' }}>
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.5rem', fontSize: '0.95rem' }}>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={{ padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.15)' }}
              />
            </label>
            <label style={{ display: 'grid', gap: '0.5rem', fontSize: '0.95rem' }}>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                style={{ padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.15)' }}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: '8px',
                color: '#000000',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in / Sign up'}
            </button>
            {error && <p className="status" style={{ color: '#dc2626' }}>{error}</p>}
          </form>
        )}

        <p className="status" style={{ textAlign: 'center', marginTop: '2rem' }}>
          Access live match tracking, detailed predictions, and personalized insights.
        </p>
      </section>
    </main>
  );
}
