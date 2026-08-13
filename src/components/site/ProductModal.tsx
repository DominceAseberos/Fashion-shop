import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ProductModalProps {
  look: {
    id: string;
    index: string;
    name: string;
    subtitle: string;
    notes: ReadonlyArray<{ label: string; value: string }>;
    image: string;
    alt: string;
  };
  onClose: () => void;
}

export function ProductModal({ look, onClose }: ProductModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleReserve = () => {
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      // Simulate 80% success rate
      if (Math.random() > 0.2) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className="relative flex max-h-[94svh] w-full max-w-5xl flex-col overflow-hidden bg-background text-foreground shadow-2xl md:max-h-[90vh] md:flex-row"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/50 text-foreground backdrop-blur-md transition-colors hover:bg-background md:right-6 md:top-6"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image Half */}
        <div className="h-[30svh] min-h-40 w-full shrink-0 overflow-hidden bg-ink md:h-auto md:min-h-0 md:w-1/2">
          <img
            src={look.image}
            alt={look.alt}
            className="h-full w-full object-cover md:max-h-[90vh]"
          />
        </div>

        {/* Details Half */}
        <div className="flex min-h-0 w-full flex-col overflow-y-auto overscroll-contain p-5 sm:p-8 md:w-1/2 md:p-12">
          <p className="smallcaps text-accent mb-2">Look {look.index}</p>
          <h2 id="modal-title" className="font-display text-4xl leading-tight md:text-5xl mb-1">
            {look.name}
          </h2>
          <p className="font-body text-base italic text-foreground/70 mb-10">
            {look.subtitle}
          </p>

          <dl className="grid gap-6 mb-12">
            {look.notes.map((n) => (
              <div key={n.label} className="border-b border-foreground/10 pb-4">
                <dt className="smallcaps text-foreground/50 mb-1">{n.label}</dt>
                <dd className="font-body text-lg text-foreground/90">{n.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto pt-8">
            {status === "idle" && (
              <button
                onClick={handleReserve}
                className="w-full bg-ink py-4 text-center font-body text-sm uppercase tracking-widest text-cream transition-colors hover:bg-accent"
              >
                Inquire & Reserve
              </button>
            )}
            
            {status === "loading" && (
              <div className="w-full bg-ink/70 py-4 text-center font-body text-sm uppercase tracking-widest text-cream flex justify-center items-center gap-3">
                <span className="block h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent"></span>
                Processing...
              </div>
            )}
            
            {status === "success" && (
              <div className="w-full bg-green-900/10 border border-green-900/20 p-4 text-center">
                <p className="font-display text-2xl text-green-900 mb-1">Reservation Confirmed</p>
                <p className="text-sm text-green-900/70">An atelier advisor will contact you shortly.</p>
              </div>
            )}
            
            {status === "error" && (
              <div className="w-full bg-red-900/10 border border-red-900/20 p-4 text-center">
                <p className="font-display text-2xl text-red-900 mb-1">Allocation Failed</p>
                <p className="text-sm text-red-900/70 mb-3">This garment is currently unavailable or high demand.</p>
                <button 
                  onClick={() => setStatus("idle")} 
                  className="text-xs uppercase tracking-wider text-red-900 underline hover:text-red-950"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
