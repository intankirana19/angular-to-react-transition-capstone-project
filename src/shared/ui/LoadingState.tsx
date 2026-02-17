// komponen loading reusable untuk fallback suspense (loading file halaman) & loading fetch data react query

type LoadingStateProps = {
  fullScreen?: boolean;
  label?: string;
};

export function LoadingState({
  fullScreen = false,
  label = 'Loading...',
}: LoadingStateProps) {
  const containerClassName = fullScreen
    ? 'flex items-center justify-center min-h-screen'
    : 'flex items-center justify-center h-64';

  return (
    <div className={containerClassName} role="status" aria-live="polite">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className="text-neutral-600">{label}</p>
      </div>
    </div>
  );
}
