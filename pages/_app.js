import '../styles/globals.css';

import BottomNav from '../components/BottomNav';
import TopNav from '../components/TopNav';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <TopNav />
      <main className="flex justify-center px-5 lg:px-0 py-32">
        <section className="w-full max-w-5xl">
          <Component {...pageProps} />
        </section>
      </main>
      <BottomNav />
    </>
  );
}

export default MyApp;
