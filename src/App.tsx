import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AppRouter } from './app/router';
import { AuthSessionProvider } from './features/auth/session/AuthSessionProvider';

export default function App() {
  const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

  return (
    <AuthSessionProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthSessionProvider>
  );
}
