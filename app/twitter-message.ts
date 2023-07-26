import { atom, getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useChangeHandler } from "./form";
import { connectTwitter, credentialsAtom } from "./twitter";

// Maximum length of a Twitter message
export const MAX_MESSAGE_LENGTH = 160;

// State variables for the Twitter message form
export const messageAtom = atom<string>("");
export const imageFileAtom = atom<File | undefined>(undefined);

export function useMessage() {
  return useAtomValue(messageAtom);
}

export function useMessageChangeHandler() {
  return useChangeHandler(messageAtom);
}

export function useImageFile() {
  return useAtomValue(imageFileAtom);
}

export function useImageFileCHangeHandler(): ChangeEventHandler<HTMLInputElement> {
  const setImage = useSetAtom(imageFileAtom);
  return useCallback(
    (event) => {
      const file = event?.target.files?.[0];
      setImage(file);
    },
    [setImage]
  );
}

export function useImageURL() {
  const imageFile = useImageFile();
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    if (imageFile) {
      const objectURL = URL.createObjectURL(imageFile);
      setUrl(objectURL);

      return () => {
        setUrl(undefined);
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [imageFile]);

  return url;
}

export function useHandleSubmit(): FormEventHandler<HTMLFormElement> {
  return useCallback(async (event) => {
    event.preventDefault();

    // Attempt to load Twitter credentials from localStorage.
    const store = getDefaultStore();
    let credentials = store.get(credentialsAtom);
    const message = store.get(messageAtom);
    const image = store.get(imageFileAtom);

    // If no credentials are found, initiate the sign-in flow via Twitter.
    if (!credentials) {
      credentials = await connectTwitter();
    }

    // Post the tweet to the API.
    const res = await fetch("/api/tweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: credentials.accessToken,
        secret: credentials.secret,
        message,
        image,
      }),
    });

    // TODO: Handle errors
    if (!res.ok) {
      throw new Error("Failed to post tweet.");
    }

    const tweet = await res.json();
  }, []);
}
