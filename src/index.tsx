import React from 'react';
import ReactDOM from 'react-dom/client';
import {MantineProvider} from "@mantine/core";
import {NotificationsProvider} from '@mantine/notifications';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './i18n/i18n';
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
            <NotificationsProvider>
                <KHComputer />
            </NotificationsProvider>
        </MantineProvider>
    </React.StrictMode>
);

serviceWorkerRegistration.register();
