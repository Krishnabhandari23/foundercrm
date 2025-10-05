// Providers.jsx - Centralize all providers to prevent circular dependencies
import React from 'react';
import { NavigationProvider } from './NavigationContext';
import { LoadingProvider } from './LoadingContext';
import { StateProvider } from './StateContext';
import { DashboardProvider } from './dashboard/DashboardProvider';

export const AppProviders = ({ children }) => (
  <NavigationProvider>
    <LoadingProvider>
      <StateProvider>
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </StateProvider>
    </LoadingProvider>
  </NavigationProvider>
);

export default AppProviders;