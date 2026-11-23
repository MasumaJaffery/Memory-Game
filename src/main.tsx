import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
}

class GameErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-dvh w-screen items-center justify-center bg-[#1b0d1f] p-6 text-center text-[#fffaf2]">
          <div className="max-w-sm rounded-2xl border border-[#e7be6a]/45 bg-[#240f2c] p-6 shadow-2xl">
            <h1
              className="text-xl font-bold text-[#f7dca0]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Something Went Wrong
            </h1>
            <p className="mt-2 text-xs text-[#d6bfd9]">
              The game encountered an unexpected interruption. Reload to continue playing.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#d9a236] px-5 text-xs font-bold text-[#210d24] transition-colors hover:bg-[#e8b449]"
            >
              Reload Game
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <GameErrorBoundary>
    <App />
  </GameErrorBoundary>
);
