"use client";

import { Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ShareButtonProps {
  slug: string;
  title: string;
  description: string;
}

export function ShareButton({ slug, title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Get the current URL on the client side
    setUrl(`${window.location.origin}/student/${slug}/portfolio`);
  }, [slug]);

  const handleShare = async () => {
    // Try native Web Share API first (mobile/modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to copy
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-4 py-2 text-sm font-medium text-white transition hover:border-[var(--ng-primary)]/40 hover:bg-white/[0.05]"
      aria-label="Share this portfolio"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
