import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { ColumnId } from "./KanbanBoard";

export type CompetitorOption = {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
  logo: string;
}

type CompetitorOptionCardProps = {
  competitor: CompetitorOption;
  index: number
  isOverlay?: boolean;
}

export type CompetitorOptionType = "CompetitorOption";

export type CompetitorOptionDragData = {
  type: CompetitorOptionType;
  competitor: CompetitorOption;
}

export function CompetitorOptionCard({ competitor, isOverlay, index }: CompetitorOptionCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: competitor.id,
    data: {
      type: "CompetitorOption",
      competitor,
    } satisfies CompetitorOptionDragData,
    attributes: {
      roleDescription: "CompetitorOption",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}>
      <CardContent className="flex items-center align-middle text-left whitespace-pre-wrap">
        <Button
          variant="ghost"
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab">
          <span className="sr-only">Move competitor</span>
          <GripVertical />
        </Button>
        {index}º - {competitor.content}
      </CardContent>
    </Card>
  );
}