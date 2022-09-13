import { Head, Html, Main, NextScript } from 'next/document';

const RootDocument = (e) => {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <title>Alumnus Plus Prototype</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default RootDocument;
