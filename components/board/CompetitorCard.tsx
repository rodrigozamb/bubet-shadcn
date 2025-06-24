import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { ColumnId } from "./KanbanBoard";
import Image from "next/image";

export type Competitor = {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
  logo: string;
}

type CompetitorCardProps = {
  competitor: Competitor;
  index: number
  isOverlay?: boolean;
}

export type CompetitorType = "Competitor";

export type CompetitorDragData = {
  type: CompetitorType;
  competitor: Competitor;
}

export function CompetitorCard({ competitor, isOverlay, index }: CompetitorCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: competitor.id,
    data: {
      type: "Competitor",
      competitor,
    } satisfies CompetitorDragData,
    attributes: {
      roleDescription: "Competitor",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("cursor-grab", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
      // index:{
      //   1:"bg-yellow-500",
      //   2:"bg-red-500",
      //   3:"bg-cyan-500",
      // }
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}>
      <CardContent className="flex items-center align-middle text-left whitespace-pre-wrap">
        <div
          className="flex justify-center items-center"
        >
          <span> {index}º - </span>
          <Image className="mr-3" alt={competitor.content} src="/logos/Logo Computaria.png" width={40} height={40}/>
          <span>
           {competitor.content}
          </span>

        </div>
      </CardContent>
    </Card>
  );
}