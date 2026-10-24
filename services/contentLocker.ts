// The provider owns offer verification and the redirect after completion.
// Configure each locker's destination in the provider dashboard, not a client timer.
declare global {
  interface Window {
    og_load?: () => void;
    ogblock?: boolean;
  }
}
let loading: Promise<void> | undefined;
export function openContentLocker(): Promise<void> {
  if (typeof window.og_load === 'function') {
    window.og_load();
    return Promise.resolve();
  }
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://appverification.live/cl/js/m5e2mw';
      script.async = true;
      // Preserve the provider's original initialization without its adblock redirect.
      window.ogblock = true;
      const timeout = window.setTimeout(() => fail(), 15000);
      const fail = () => {
        clearTimeout(timeout);
        script.remove();
        loading = undefined;
        reject(new Error('The offer window could not load. Please try again or check your connection.'));
      };
      script.onerror = fail;
      script.onload = () => {
        clearTimeout(timeout);
        if (typeof window.og_load !== 'function') { fail(); return; }
        resolve();
      };
      document.head.append(script);
    });
  }
  return loading.then(() => {
    if (typeof window.og_load !== 'function') throw new Error('The offer window is unavailable. Please try again.');
    window.og_load();
  });
}
