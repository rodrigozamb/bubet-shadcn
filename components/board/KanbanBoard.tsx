import { useCallback, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  Active,
  Over,
  DataRef,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Column, BoardColumn, BoardContainer, ColumnDragData } from "./BoardColumn";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { Competitor, CompetitorCard, CompetitorDragData } from "./CompetitorCard";

type NestedColumn = Column & {
  children?: NestedColumn[];
};

const defaultCols: NestedColumn[] = [
  {
    id: "list-of-competitors",
    title: "Competidores",
    // children: [
    //   { id: "computaria", title: "Computaria" },
    //   { id: "s/a", title: "S/A" },
    //   { id: "infanteria", title: "Infanteria" }
    // ]
  },
  {
    id: "bet",
    title: "Aposta",
    // children: [
    //   { id: "bandida", title: "Bandida" },
    //   { id: "rateria", title: "Rateria" }
    // ]
  }
];

export type ColumnId = (typeof defaultCols)[number]["id"];

const initialCompetitors: Competitor[] = [
  
  {
    id: "Meritíssima",
    columnId: "list-of-competitors",
    content: "Meritíssima",
    logo: "logo"
  },
  {
    id: "s/a",
    columnId: "list-of-competitors",
    content: "S/A",
    logo: "logo"
  },
  {
    id: "Infanteria",
    columnId: "list-of-competitors",
    content: "Infanteria",
    logo: "logo"
  },
  {
    id: "Rateria",
    columnId: "list-of-competitors",
    content: "Rateria",
    logo: "logo"
  },
  {
    id: "Ufuteria",
    columnId: "list-of-competitors",
    content: "Ufuteria",
    logo: "logo"
  },
  {
    id: "UFSCar",
    columnId: "list-of-competitors",
    content: "UFSCar",
    logo: "logo"
  },
  {
    id: "Artilharia",
    columnId: "list-of-competitors",
    content: "Artilharia",
    logo: "logo"
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<NestedColumn[]>(defaultCols);
  const [competitors, setCompetitors] = useState<Competitor[]>(initialCompetitors);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeCompetitor, setActiveCompetitor] = useState<Competitor | null>(null);
  const dndContextId = useId();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  const hasDraggableData = <T extends Active | Over>(
    entry: T | null | undefined
  ): entry is T & {
    data: DataRef<CompetitorDragData | ColumnDragData>;
  } => {
    if (!entry) {
      return false;
    }

    const data = entry.data.current;

    if (data?.type === "Column" || data?.type === "Competitor") {
      return true;
    }

    return false;
  };

  // Helper function to flatten nested columns
  const flattenColumns = useCallback((cols: NestedColumn[]): Column[] => {
    return cols.flatMap((col) =>
      col.children ? [{ id: col.id, title: col.title }, ...flattenColumns(col.children)] : [col]
    );
  }, []);

  const flatColumns = useMemo(() => flattenColumns(columns), [columns, flattenColumns]);
  const columnsId = useMemo(() => flatColumns.map((col) => col.id), [flatColumns]);

  // recursively render nested columns
  const renderNestedColumns = (cols: NestedColumn[]) => {
    return cols.map((col) => {
      const competitorsInColumn = competitors.filter((competitor) => competitor.columnId === col.id);

      if (col.children && col.children.length > 0) {
        return (
          <div key={col.id} className="flex flex-col">
            {competitorsInColumn.length > 0 && <BoardColumn column={col} competitors={competitorsInColumn} />}
            <div className={competitorsInColumn.length > 0 ? "ml-4 mt-2" : ""}>
              {renderNestedColumns(col.children)}
            </div>
          </div>
        );
      } else {
        return <BoardColumn key={col.id} column={col} competitors={competitorsInColumn} />;
      }
    });
  };

  const onDragStart = (event: DragStartEvent) => {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Competitor") {
      setActiveCompetitor(data.competitor);
      return;
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveCompetitor(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    } else if (activeData?.type === "Competitor") {
      const newColumnId = hasDraggableData(over)
        ? over.data.current?.type === "Column"
          ? over.id as ColumnId
          : over.data.current?.competitor.columnId
        : over.id as ColumnId;

      const oldColumnId = activeData.competitor.columnId;

      if (oldColumnId !== newColumnId) {
        setCompetitors((competitors) => {
          const cp =  competitors.map((competitor) =>
            competitor.id === activeId && newColumnId ? { ...competitor, columnId: newColumnId } : competitor
          );
          console.log(cp)
          return cp
        });
      }
    }
    //onUpdateBets(bets)
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveACompetitor = activeData?.type === "Competitor";
    const isOverACompetitor = overData?.type === "Competitor";

    if (!isActiveACompetitor) return;

    if (isActiveACompetitor && isOverACompetitor) {
      setCompetitors((competitors) => {
        const activeIndex = competitors.findIndex((competitor) => competitor.id === activeId);
        const overIndex = competitors.findIndex((competitor) => competitor.id === overId);
        const activeCompetitor = competitors[activeIndex];
        const overCompetitor = competitors[overIndex];
        if (activeCompetitor && overCompetitor && activeCompetitor.columnId !== overCompetitor.columnId) {
          activeCompetitor.columnId = overCompetitor.columnId;
          return arrayMove(competitors, activeIndex, overIndex - 1);
        }

        return arrayMove(competitors, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    if (isActiveACompetitor && isOverAColumn) {
      setCompetitors((competitors) => {
        const activeIndex = competitors.findIndex((competitor) => competitor.id === activeId);
        const activeCompetitor = competitors[activeIndex];
        if (activeCompetitor) {
          activeCompetitor.columnId = overId as ColumnId;
          return arrayMove(competitors, activeIndex, activeIndex);
        }
        return competitors;
      });
    }
  };

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}>
      <BoardContainer>
        <SortableContext items={columnsId}>
          {renderNestedColumns(columns)}
        </SortableContext>
      </BoardContainer>

      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                column={activeColumn}
                competitors={competitors.filter((competitor) => competitor.columnId === activeColumn.id)}
                isOverlay
                
              />
            )}
            {/* {activeCompetitor && <CompetitorCard competitor={activeCompetitor} isOverlay />} */}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}