import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { Loader } from './components/loader/loader';

interface ISocketResponse {
  isGarageDoorClosed: boolean;
  garageTemperature: number;
  outsideTemperature: number;
}

const getReadableTemperature = (temperature: number) => (
  <>{temperature?.toFixed(1)} &#8451;</>
);

const Item = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`p-8 h-1/3 w-full text-[6vw] inline-flex items-center justify-center ${className}`}
  >
    {children}
  </div>
);

export const App = (): JSX.Element => {
  const [isGarageDoorClosed, setIsGarageDoorClosed] = useState<
    undefined | boolean
  >(undefined);
  const [garageTemperature, setGarageTemperature] = useState<
    undefined | number
  >(undefined);
  const [outsideTemperature, setOutsideTemperature] = useState<
    undefined | number
  >(undefined);
  const [, setSocket] = useState<null | ReturnType<typeof io>>(null);

  useEffect(() => {
    const socketOptions = {
      path: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/socket.io`,
    };

    const connection = process.env.NEXT_PUBLIC_SOCKET_HOST
      ? io(process.env.NEXT_PUBLIC_SOCKET_HOST, socketOptions)
      : io(socketOptions);

    connection.on(
      'update',
      ({
        isGarageDoorClosed: newIsGarageDoorClosed,
        garageTemperature: newGarageTemperature,
        outsideTemperature: newOutsideTemperature,
      }: ISocketResponse) => {
        setIsGarageDoorClosed(newIsGarageDoorClosed);
        setGarageTemperature(newGarageTemperature);
        setOutsideTemperature(newOutsideTemperature);
      },
    );

    setSocket(connection);
  }, []);

  const isGarageDoorDataLoaded = typeof isGarageDoorClosed === 'boolean';
  const getGarageDoorClasses = () => {
    if (!isGarageDoorDataLoaded) return 'bg-gray-300';
    if (isGarageDoorClosed) return 'bg-green-600 text-white';
    return 'bg-red-600 text-white';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Item
        className={`border-b-2 border-solid border-gray-700 ${getGarageDoorClasses()}`}
      >
        Autotallin ovi on{' '}
        {isGarageDoorDataLoaded && (isGarageDoorClosed ? 'kiinni' : 'auki')}
        {!isGarageDoorDataLoaded && <Loader />}
      </Item>
      <Item className="text-gray-900 bg-gray-300 border-b-2 border-gray-700 border-solid">
        Autotallin lämpötila{' '}
        {garageTemperature ? (
          getReadableTemperature(garageTemperature)
        ) : (
          <Loader />
        )}
      </Item>
      <Item className="text-gray-900 bg-gray-300">
        Ulkolämpötila{' '}
        {outsideTemperature ? (
          getReadableTemperature(outsideTemperature)
        ) : (
          <Loader />
        )}
      </Item>
    </div>
  );
};
