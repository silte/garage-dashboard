import dynamic from 'next/dynamic';

export const AppDynamic = dynamic(
  () => import('./App').then((mod) => mod.App),
  {
    ssr: false,
  },
);
