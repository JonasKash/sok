import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Starting app initialization...');
console.log('React imported:', React);
console.log('ReactDOM imported:', ReactDOM);
console.log('App imported:', App);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          fontFamily: 'system-ui',
          background: '#fff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Erro ao carregar aplicação</h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            {this.state.error?.message || 'Ocorreu um erro inesperado'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  throw new Error("Could not find root element to mount to");
}

try {
  console.log('Creating root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('Root created, rendering...');
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('App rendered successfully!');
} catch (error) {
  console.error('Failed to render app:', error);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui; background: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Erro ao inicializar aplicação</h1>
        <p style="color: #6b7280; margin-bottom: 1rem;">${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">
          Recarregar página
        </button>
      </div>
    `;
  }
}