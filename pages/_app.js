import "../styles/globals.css";

import { AuthProvider, useAuth } from "../components/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { themeChange } from "theme-change";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const queryClient = new QueryClient();

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <>
      <Head>
        <title>
          {router.pathname === "/"
            ? "SOMENAME | Home"
            : router.pathname === "/me"
            ? "SOMENAME | Me"
            : router.pathname === "/feed"
            ? "SOMENAME | My Feed"
            : router.pathname === "/signin"
            ? "SOMENAME | Sign in"
            : router.pathname === "/signup"
            ? "SOMENAME | Sign up"
            : router.pathname === "/messages"
            ? "SOMENAME | My Messages"
            : "SOMENAME | Page not registered"}
        </title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          charSet="urf-8"
        />
      </Head>

      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <>
            <Navbar />

            <main className="flex justify-center">
              <section className="w-full max-w-5xl py-32 px-5 lg:px-0 min-h-screen">
                <AnimatePresence mode="wait">
                  <Component {...pageProps} key={router.pathname} />
                </AnimatePresence>
              </section>
            </main>

            <Toaster
              position="top-left"
              toastOptions={{
                style: {
                  padding: "16px",
                  gap: "8px",
                },
              }}
            />
          </>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
