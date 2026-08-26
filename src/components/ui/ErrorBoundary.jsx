import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary atrapó:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, maxWidth: 600, margin: "40px auto" }}>
          <h2 style={{ color: "#E05252", marginBottom: 12 }}>
            Algo se rompió
          </h2>
          <pre
            style={{
              background: "#1C1B19",
              color: "#E8E4DA",
              padding: 16,
              borderRadius: 8,
              overflow: "auto",
              fontSize: 13,
            }}
          >
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
          <button
            className="btn btn--primary"
            style={{ marginTop: 16 }}
            onClick={() => this.setState({ error: null })}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
