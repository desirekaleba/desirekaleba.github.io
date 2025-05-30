// Utility functions for tracking events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag && import.meta.env.PROD) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && import.meta.env.PROD) {
    window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
}; 