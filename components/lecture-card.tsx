"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lecture } from "@/lib/types";

export function LectureCard({ lecture, manage = false, onEdit, onDelete }: { lecture: Lecture; manage?: boolean; onEdit?: () => void; onDelete?: () => void }) {
  const start = new Date(lecture.scheduledStart);
  const ended = start.getTime() < Date.now();
  return <Card size="sm" className="h-auto border-[var(--ng-primary)]/15">
    <CardContent className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><h3 className="truncate font-semibold">{lecture.title}</h3><p className="mt-1 text-xs text-muted-foreground">Hosted by {lecture.academicianName}</p></div>
        <Badge variant={lecture.status === "published" ? "secondary" : "outline"}>{lecture.status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{lecture.description || "Live learning session for students."}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>{start.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>{lecture.course && <span>{lecture.course}</span>}{lecture.audience && <span>{lecture.audience}</span>}</div>
      <div className="flex flex-wrap gap-2 pt-1">
        {!manage && <a className={`inline-flex h-7 items-center rounded-lg bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground ${ended || lecture.status !== "published" ? "pointer-events-none opacity-50" : "hover:bg-primary/80"}`} href={lecture.meetUrl} target="_blank" rel="noreferrer">{ended ? "Session ended" : "Join Google Meet"}</a>}
        {manage && <><Button size="sm" variant="outline" onClick={onEdit}>Edit</Button><Button size="sm" variant="ghost" className="text-destructive" onClick={onDelete}>Delete</Button></>}
      </div>
    </CardContent>
  </Card>;
}
