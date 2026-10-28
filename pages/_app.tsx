import type { AppProps } from 'next/app';
import '../styles/globals.css';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ServiceWorkerRegistration />
      <Component {...pageProps} />
    </>
  );
}
