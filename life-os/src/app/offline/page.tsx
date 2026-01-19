export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-8">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center border border-violet-500/20">
          <svg
            className="w-10 h-10 text-violet-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-7.072-7.072m0 0l2.829 2.829m4.243-2.829l2.829-2.829m-2.829 2.829L9 9"
            />
          </svg>
        </div>
        
        {/* Content */}
        <h1 className="text-2xl font-bold text-white mb-3">
          You're Offline
        </h1>
        <p className="text-white/50 mb-8 leading-relaxed">
          Life OS needs an internet connection to sync your data. 
          Your local changes are saved and will sync when you're back online.
        </p>
        
        {/* Action */}
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-all font-medium border border-violet-500/30"
        >
          Try Again
        </button>
        
        {/* Status indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/30">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          Waiting for connection...
        </div>
      </div>
    </div>
  );
}
