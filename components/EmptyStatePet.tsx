interface EmptyStatePetProps {
  onExit?: () => void;
}

export default function EmptyStatePet({ onExit }: EmptyStatePetProps) {
  return (
    <div className="relative flex-1 min-h-0 w-full flex flex-col items-center justify-center bg-background p-6">
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
      <div className="flex flex-col items-center gap-3 text-center max-w-xs">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a day to view or create events
        </p>
      </div>
    </div>
  );
}
