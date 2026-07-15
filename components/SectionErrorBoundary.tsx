"use client";

import { Component, type ReactNode } from "react";

export default class SectionErrorBoundary extends Component<
  { children: ReactNode; label?: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`[SectionErrorBoundary${this.props.label ? ` ${this.props.label}` : ""}]`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section-pad bg-cream">
          <div className="container-px">
            <p className="text-sm text-muted">
              This section failed to load. Please refresh or try again later.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
