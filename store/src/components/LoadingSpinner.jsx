function LoadingSpinner({ fullScreen = false, text = 'Loading...' }) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-40 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm'
    : 'w-full flex items-center justify-center py-10';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-amber-500 animate-spin" />
        {text && <p className="text-sm font-medium text-slate-600">{text}</p>}
      </div>
    </div>
  );
}

export default LoadingSpinner;

