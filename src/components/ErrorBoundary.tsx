"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

export function ErrorState({
  message = "We couldn't load this section.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface/60 px-6 py-10 text-center"
    >
      <AlertTriangle className="size-7 text-brand-red" aria-hidden />
      <p className="text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
        >
          <RotateCcw className="size-4" aria-hidden /> Try again
        </button>
      )}
    </div>
  );
}

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

/** Catches render errors in a subtree so one broken row can't take down the page. */
export default class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="gutter">
          <ErrorState
            message={this.props.fallbackMessage}
            onRetry={() => this.setState({ error: null })}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
