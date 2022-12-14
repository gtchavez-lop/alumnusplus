import "../styles/globals.css";

import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Wicket - A web3 social media platform</title>

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />

        <link rel="icon" href="/newlogo.svg" />

        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Navbar />

      <main className="flex justify-center bg-base-100 select-none overflow-x-hidden">
        <section className="w-full max-w-5xl px-5 lg:px-0 min-h-screen">
          <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.pathname} />
          </AnimatePresence>
        </section>
      </main>

      <Toaster
        position="bottom"
        toastOptions={{
          style: {
            padding: "5px",
            gap: "8px",
          },
        }}
      />
    </>
  );
}

export default MyApp;
