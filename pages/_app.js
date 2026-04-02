// pages/_app.js
import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useScrollReveal(router.pathname); // re-runs on every route change
  return <Component {...pageProps} />;
}
