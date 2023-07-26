"use client";

import { TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { getFirebaseAuth } from "./firebase";
import { useCallback, useState } from "react";

/**
 * Twitter credentials.
 */
export const credentialsAtom = atomWithStorage<Credentials | undefined>(
  "twitter:credentials",
  undefined
);

/**
 * Initiates the sign-in flow via Twitter.
 */
export async function connectTwitter() {
  const auth = getFirebaseAuth();

  // Initialize Twitter auth provider
  // https://firebase.google.com/docs/reference/js/auth.twitterauthprovider
  const provider = new TwitterAuthProvider();
  // Open the Twitter sign-in window
  // https://firebase.google.com/docs/reference/js/auth.md#signinwithpopup
  const res = await signInWithPopup(auth, provider);
  const credential = TwitterAuthProvider.credentialFromResult(res);

  if (!credential?.accessToken || !credential?.secret) {
    console.log(credential);
    throw new Error("Invalid Twitter credentials.");
  }

  const result = {
    accessToken: credential.accessToken,
    secret: credential.secret,
  };

  // Save Twitter credentials to localStorage.
  const store = getDefaultStore();
  store.set(credentialsAtom, result);

  return result;
}

/**
 * Gets Twitter credentials from localStorage, or
 * initiates the sign-in flow via Twitter.
 */
export async function getTwitterCredentials(): Promise<Credentials> {
  const store = getDefaultStore();
  const credentials = store.get(credentialsAtom);
  return credentials ? Promise.resolve(credentials) : connectTwitter();
}

/**
 * Returns Twitter credentials from localStorage.
 */
export function useTwitterCredentials() {
  return useAtomValue(credentialsAtom);
}

/**
 * React hooks that triggers the sign-in flow via Twitter.
 */
export function useConnectTwitter() {
  const [inFlight, setInFlight] = useState(false);
  const callback = useCallback(() => {
    setInFlight(true);
    connectTwitter().finally(() => {
      setInFlight(false);
    });
  }, []);

  return [callback, inFlight] as const;
}

/**
 * React hook that clears Twitter credentials from localStorage.
 */
export function useDisconnectTwitter() {
  const setCredentials = useSetAtom(credentialsAtom);
  return useCallback(() => {
    setCredentials(undefined);
  }, [setCredentials]);
}

type Credentials = {
  accessToken: string;
  secret: string;
};
