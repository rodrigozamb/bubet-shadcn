import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { cva } from "class-variance-authority";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";
import { Competitor, CompetitorCard } from "./CompetitorCard";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export type ColumnDragData = {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  competitors: Competitor[];
  isOverlay?: boolean;
}

export const BoardColumn = ({ column, competitors, isOverlay }: BoardColumnProps) => {
  const competitorIds = useMemo(() => {
    return competitors.map((competitor) => competitor.id);
  }, [competitors]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva(
    "h-80 w-[250px] bg-zinc-300 flex flex-col flex-shrink-0 snap-center mt-4 overflow-y-auto",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary"
        }
      }
    }
  );
  console.log(competitors)
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}>
      <CardHeader className="p-4 font-semibold border-b-2 bg-gray-100 dark:bg-zinc-800 flex flex-row items-center justify-between">
        <h1>{column.title}</h1>
        <Badge variant="outline">{competitors.length}</Badge>
      </CardHeader>
      <div className=" overflow-y-auto">
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={competitorIds}>
            {competitors.length === 0 ? (
              <div className="flex flex-grow items-center justify-center">
                <p className="text-gray-600">Escolha seus competidores.</p>
              </div>
            ) : 
            
            <div className="flex flex-grow flex-col  gap-2 p-2 ">
              {
                competitors.map((competitor, index) => <CompetitorCard key={competitor.id} competitor={competitor} index={index+1}/>)
              }
            </div>
            
            }
          </SortableContext>
        </CardContent>
      </div>
    </Card>
  );
}

export const BoardContainer = ({ children }: { children: React.ReactNode }) => {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea className={variations({ dragging: dndContext.active ? "active" : "default" })}>
      <div className="flex gap-4 items-start flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}