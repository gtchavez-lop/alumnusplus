import { Head, Html, Main, NextScript } from 'next/document';

const RootDocument = (e) => {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default RootDocument;
