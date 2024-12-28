import { Loader as OrinalLoader } from '@silte/react-loader';
import React from 'react';

export const Loader = (): JSX.Element => {
  return (
    <OrinalLoader
      className="flex items-center justify-center mx-auto my-12 sm:my-20 md:my-28 lg:my-36"
      loaderColor="#3182ce"
    />
  );
};
