export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center space-x-2 font-mono text-xs text-cyber-cyan ${className}`}>
      <span className="w-4 h-4 border-2 border-t-transparent border-cyber-cyan rounded-full animate-spin"></span>
      <span className="tracking-wider uppercase">DECRYPTING VECTOR STREAM...</span>
    </div>
  );
}
