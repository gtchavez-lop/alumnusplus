import "../styles/globals.css";

import { AuthProvider, useAuth } from "../components/AuthContext";

import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { themeChange } from "theme-change";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <>
      <Head>
        <title>Directus + NextJS</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          charSet="urf-8"
        />
      </Head>

      <AuthProvider>
        <>
          <Navbar />

          <main className="flex justify-center">
            <section className="w-full max-w-5xl py-36 px-5 lg:px-0 min-h-screen">
              <AnimatePresence mode="wait">
                <Component {...pageProps} key={router.pathname} />
              </AnimatePresence>
            </section>
          </main>

          <Toaster position="top-left" />
        </>
      </AuthProvider>
    </>
  );
}

export default MyApp;
