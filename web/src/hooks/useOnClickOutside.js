import { useEffect } from 'react';

/**
 * @param {Array} refs array of refs to ignore clicks on / decendants of
 * @param {Function} handler function to call on outside click
 */
export function useOnClickOutside(refs, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (
                refs.some(
                    (ref) => !ref.current || ref.current.contains(event.target),
                )
            ) {
                return;
            }
            handler(event);
        };

        document.addEventListener('click', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('click', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [refs]);
}
