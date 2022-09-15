import React, { Component } from "react"

interface ErrorBoundaryProps {children?: React.ReactNode}
interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state = { hasError: false }
  
    static getDerivedStateFromError(error: unknown) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }
  
    componentDidCatch(error: unknown, errorInfo: unknown) {
        // You can also log the error to an error reporting service
        console.log(`logErrorToMyService`, error, errorInfo)
    }
  
    render() {
        if (this.state.hasError) {
        // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>
        }
  
        return this.props.children 
    }
}
