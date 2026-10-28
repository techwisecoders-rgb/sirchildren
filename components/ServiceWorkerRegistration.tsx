import { useEffect } from 'react';

/** Registers /sw.js in supported browsers. Service workers require HTTPS,
 * except on localhost during development.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.info('Universal Children service worker registered:', registration.scope);
      })
      .catch((error: unknown) => {
        console.error('Universal Children service worker registration failed:', error);
      });
  }, []);

  return null;
}
