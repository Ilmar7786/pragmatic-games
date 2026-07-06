import { RouterProvider } from './providers/router';
import { StoreProvider } from './providers/store';

export function App() {
  return (
    <StoreProvider>
      <RouterProvider />
    </StoreProvider>
  );
}
