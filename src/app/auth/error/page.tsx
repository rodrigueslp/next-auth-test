export default function AuthError({
    searchParams,
  }: {
    searchParams: { error?: string }
  }) {
    console.error('Auth error:', searchParams.error);
    return (
      <div>
        <h1>Auth Error</h1>
        <p>Error: {searchParams.error}</p>
      </div>
    );
  }
