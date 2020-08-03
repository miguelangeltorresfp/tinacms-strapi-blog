import '../styles/index.css';

import {
  StrapiMediaStore,
  StrapiProvider,
  StrapiClient,
} from 'react-tinacms-strapi';
import { TinaCMS, TinaProvider } from 'tinacms';

import { useMemo } from 'react';

export default function MyApp({ Component, pageProps }) {
  const cms = useMemo(
    () =>
      new TinaCMS({
        toolbar: true,
        enabled: true,
        apis: {
          strapi: new StrapiClient(process.env.STRAPI_URL),
        },
        media: {
          store: new StrapiMediaStore(process.env.STRAPI_URL),
        },
      }),
    []
  );
  return (
    <TinaProvider cms={cms}>
      <StrapiProvider
        onLogin={() => {
          /* we'll come back to this */
        }}
        onLogout={() => {
          /* we'll come back to this */
        }}
      >
        <Component {...pageProps} />
      </StrapiProvider>
    </TinaProvider>
  );
}
