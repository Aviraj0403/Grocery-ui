import { useEffect, useState, useCallback } from 'react';

const RAZORPAY_CDN = 'https://checkout.razorpay.com/v1/checkout.js';

/**
 * useRazorpay – dynamically loads the Razorpay checkout.js SDK.
 *
 * Usage:
 *   const { isLoaded, openRazorpay } = useRazorpay();
 *
 *   openRazorpay(options)  – opens the Razorpay payment modal.
 *   options shape follows the Razorpay standard options object.
 */
const useRazorpay = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        // If script is already present, mark loaded immediately
        if (document.querySelector(`script[src="${RAZORPAY_CDN}"]`)) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = RAZORPAY_CDN;
        script.async = true;

        script.onload = () => setIsLoaded(true);
        script.onerror = () => {
            setLoadError(true);
            console.error('[useRazorpay] Failed to load Razorpay checkout.js');
        };

        document.body.appendChild(script);

        return () => {
            // Do NOT remove on cleanup – Razorpay SDK should stay loaded
        };
    }, []);

    /**
     * Opens the Razorpay modal.
     * @param {Object} options  Standard Razorpay options object.
     *   Required: key, order_id, amount, currency, name, handler
     */
    const openRazorpay = useCallback((options) => {
        if (!isLoaded || loadError) {
            console.error('[useRazorpay] SDK not loaded yet. Try again.');
            return;
        }
        if (!window.Razorpay) {
            console.error('[useRazorpay] window.Razorpay not available.');
            return;
        }
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
            // Bubble up via the options.onPaymentFailed callback if provided
            if (typeof options.onPaymentFailed === 'function') {
                options.onPaymentFailed(response);
            } else {
                console.error('[Razorpay] Payment failed:', response.error);
            }
        });
        rzp.open();
    }, [isLoaded, loadError]);

    return { isLoaded, loadError, openRazorpay };
};

export default useRazorpay;
