class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-left max-w-lg w-full" dir="ltr">
            <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong!</h2>
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg font-mono overflow-auto">{this.state.error?.toString()}</p>
            <p className="mt-4 text-stone-600 text-sm">أرجو إرسال هذه الرسالة لي لإصلاح العطل.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
