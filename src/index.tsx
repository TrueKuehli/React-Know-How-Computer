import React from 'react';
import ReactDOM from 'react-dom/client';
import {MantineProvider} from "@mantine/core";

import KHComputer from './components/KHComputer';
import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <MantineProvider
          theme={{
              colorScheme: 'light',
              primaryColor: 'indigo',
              primaryShade: 5,
          }}
      >
          <KHComputer />
      </MantineProvider>
  </React.StrictMode>
);

