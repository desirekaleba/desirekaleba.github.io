import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const Analytics = () => {
  const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
  const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID;
  const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

  useEffect(() => {
    if (!ENABLE_ANALYTICS || import.meta.env.DEV) {
      return;
    }

    // Google Analytics
    if (GA_TRACKING_ID) {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag function
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };

      // Configure Google Analytics
      window.gtag('js', new Date());
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true, // GDPR compliance
        allow_google_signals: false, // Disable advertising features
        allow_ad_personalization_signals: false,
      });

      // Track page views on route changes
      const handleRouteChange = () => {
        window.gtag('config', GA_TRACKING_ID, {
          page_title: document.title,
          page_location: window.location.href,
        });
      };

      // Listen for navigation events
      window.addEventListener('popstate', handleRouteChange);
      
      // For SPA navigation, you might need to call this manually
      // or integrate with your router
      
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    }

    // Hotjar
    if (HOTJAR_ID) {
      const hotjarScript = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
      
      const script = document.createElement('script');
      script.innerHTML = hotjarScript;
      document.head.appendChild(script);
    }
  }, [GA_TRACKING_ID, HOTJAR_ID, ENABLE_ANALYTICS]);

  return null;
};

export default Analytics; 