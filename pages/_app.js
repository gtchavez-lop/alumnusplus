import "../styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import NewNavbar from "../components/NewNavbar";
import { Provider as SupbaseProvider } from "react-supabase";
import { Toaster } from "react-hot-toast";
import __supabase from "../lib/supabase";
import { themeChange } from "theme-change";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const queryClient = new QueryClient();

  useEffect(() => {
    themeChange(false);

    // check if localStorage has a theme
    if (localStorage.getItem("theme")) {
      document.body.setAttribute("data-theme", localStorage.getItem("theme"));
    } else {
      document.body.setAttribute("data-theme", "wicket-light");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Wicket - A web3 social media platform</title>

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />

        <link rel="icon" href="/newlogo.svg" />

        {/* link manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <SupbaseProvider value={__supabase}>
        <QueryClientProvider client={queryClient}>
          <>
            <NewNavbar />

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
                  padding: "16px",
                  gap: "8px",
                },
              }}
            />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </>
        </QueryClientProvider>
      </SupbaseProvider>
    </>
  );
}

export default MyApp;
