import "../styles/globals.scss";
import { Metadata } from "next";
import Script from "next/script";
import LocationSelector from "@/component/locationSelector/LocationSelector";

export const metadata: Metadata = {
  metadataBase: new URL("https://autocracymachinery.com"),
  title:
    "Trencher Machines Manufacturer & Supplier India | Autocracy Machinery",
  description:
    "Autocracy Machinery is India's global manufacturer of equipment and attachments, trenchers, padding, pole stacking, forklift, lake cleaner, sod harvester, sprigger and infielder.",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    siteName: "Autocracy Machinery",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://d3du1kxieyd1np.cloudfront.net/assets/autcracy_machinery_logo.png",
        width: 1200,
        height: 630,
        alt: "Autocracy Machinery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@autocracymachinery",
    creator: "@autocracymachinery",
    images: ["https://d3du1kxieyd1np.cloudfront.net/assets/autcracy_machinery_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="qtNbHQTUzwDs0hGB2WCWh10mc6R-S6c4Cui05tNbo84"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5FHWPPR4');
          `,
        }}
      />

      {/* Google Analytics 4 (gtag.js) */}
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-WQJGTVCMVR"
      />
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WQJGTVCMVR');
          `,
        }}
      />

      {/* Google Ads conversion helper: gtag_report_conversion */}
      <Script
        id="ga4-conversion-function"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-16535125041/wie8CNrPhakZELH4x8w9',
                  'event_callback': callback
              });
              return false;
            }
          `,
        }}
      />

      {/* Zoho SalesIQ Tracking */}
      <Script
        id="zoho-salesiq"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var $zoho = $zoho || {};
            $zoho.salesiq = $zoho.salesiq || {
              widgetcode: '${
                process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET ||
                "siq4f016facf7a03801f99d2b59751634f50b4d62e351824b42da0066964937b0a8a924e77ab8ea3dde371fb1cf4a3f4084"
              }',
              values: {},
              ready: function (){
                var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

                if (!isIOS || !$zoho.salesiq.chat || !$zoho.salesiq.visitor) {
                  return;
                }

                try {
                  $zoho.salesiq.visitor.question('Hi, I need assistance with Autocracy Machinery.');
                  $zoho.salesiq.chat.mode('click');
                } catch (error) {
                  console.warn('Zoho SalesIQ iOS chat mode setup failed', error);
                }
              }
            };
            var d = document;
            var s = d.createElement('script');
            s.type = 'text/javascript';
            s.id = 'zsiqscript';
            s.src = 'https://salesiq.zoho.in/widget';
            var t = d.getElementsByTagName('script')[0];
            t.parentNode.insertBefore(s, t);
          `,
        }}
      />

      {/* Facebook Meta Pixel */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '650403454281912');
            fbq('track', 'PageView');
          `,
        }}
      />

      <body style={{ position: "relative" }}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5FHWPPR4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Facebook Meta Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=650403454281912&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LocationSelector />
        {children}
      </body>
    </html>
  );
}
