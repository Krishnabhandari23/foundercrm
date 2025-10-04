import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log to browser console so it's visible in DevTools (and in environments that capture console output)
    console.error('[ErrorBoundary] Caught error:', error, info)
    this.setState({ info })
  }

  render() {
    const { hasError, error } = this.state
    if (hasError) {
      return (
        <div style={{
          padding: 24,
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          color: '#111827'
        }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>{String(error)}</pre>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#111827', color: '#fff' }}>Reload</button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
