'use client';

import { useAuth } from '@clerk/nextjs';
import { init } from '@instantdb/react';
import { useEffect } from 'react';

// Insert your app ID from https://instantdb.com/dash
const APP_ID = '<YOUR_APP_ID>';
// Use the Clerk client name that you set in the "Auth" tab of the InstantDB dashboard
const CLERK_CLIENT_NAME = 'clerk';

// Initialize InstantDB
const db = init({ appId: APP_ID });

export default function Page() {
  // Use `useAuth()` to get the `getToken()` and `signOut()` methods
  const { getToken, signOut } = useAuth();

  // Create a function to sign in to InstantDB with the Clerk token
  const signInToInstantWithClerkToken = async () => {
    // Get the JWT (token) from Clerk for your signed-in user
    const token = await getToken();

    if (!token) {
      return;
    }

    // Create a long-lived session with InstantDB for your Clerk user
    // It will look up the user by email or create a new user with
    // the email provided in the session token
    db.auth.signInWithIdToken({
      clientName: CLERK_CLIENT_NAME,
      idToken: token,
    });
  };

  useEffect(() => {
    signInToInstantWithClerkToken();
  }, []);

  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error signing in to InstantDB! {error.message}</div>;
  }

  if (user) {
    return (
      <div>
        <p>Signed in with InstantDB through Clerk!</p>{' '}
        <button
          onClick={() => {
            // First sign out of InstantDB to clear the InstantDB session
            db.auth.signOut().then(() => {
              // Then, sign out of Clerk to clear the Clerk session
              signOut();
            });
          }}
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={signInToInstantWithClerkToken}>
        Sign in to InstantDB
      </button>
    </div>
  );
}
