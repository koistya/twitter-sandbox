import { WritableAtom, useSetAtom } from "jotai";
import { ChangeEvent, useCallback } from "react";

/**
 * React hooks that helps with handling input field changes.
 */
export function useChangeHandler<
  AtomType extends WritableAtom<any, any[], any>
>(atom: AtomType) {
  const set = useSetAtom(atom);
  return useCallback(
    (event: ChangeEvent<HTMLElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        set(event.target.value);
      } else {
        throw new Error();
      }
    },
    [set]
  );
}
