"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface YouTubeCourseCardProps {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
  description: string;
  relevance: number;
  index?: number;
}

export function YouTubeCourseCard({
  title,
  videoId,
  thumbnail,
  channel,
  description,
  relevance,
  index = 0,
}: YouTubeCourseCardProps) {
  const openVideo = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className="cursor-pointer hover:border-[var(--ng-primary)]/30 transition-all duration-200 hover:shadow-lg overflow-hidden group"
        onClick={openVideo}
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to medium quality thumbnail if maxresdefault fails
              const target = e.target as HTMLImageElement;
              if (target.src.includes("maxresdefault")) {
                target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }
            }}
          />
          {/* YouTube play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                className="ml-1"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
          {relevance >= 90 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5">
                Top Pick
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-[var(--ng-primary)] transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              {channel}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {relevance}% match
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
