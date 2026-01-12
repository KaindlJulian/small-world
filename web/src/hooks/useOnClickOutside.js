import { useEffect } from 'react';

/**
 * @param {Array} refs array of refs to ignore clicks on / decendants of
 * @param {Function} handler function to call on outside click
 */
export function useOnClickOutside(
    handler,
    { refs = [], ignoreAttribute = undefined },
) {
    useEffect(() => {
        const listener = (event) => {
            if (
                ignoreAttribute &&
                event.target.closest(`[${ignoreAttribute}]`)
            ) {
                return;
            }

            if (
                refs.some(
                    (ref) => !ref.current || ref.current.contains(event.target),
                )
            ) {
                return;
            }

            handler(event);
        };

        document.addEventListener('click', listener, true);
        document.addEventListener('touchstart', listener, true);

        return () => {
            document.removeEventListener('click', listener, true);
            document.removeEventListener('touchstart', listener, true);
        };
    }, [refs, ignoreAttribute]);
}
