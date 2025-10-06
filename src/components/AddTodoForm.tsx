import { useState } from "react";
import { Plus, Flag, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { TodoPriority } from "./TodoItem";

type AddTodoFormProps = {
  onAdd: (text: string, priority?: TodoPriority, dueDate?: string) => void;
};

const priorities: TodoPriority[] = ["high", "medium", "low"];

const priorityColors = {
  high: "bg-priority-high text-white hover:bg-priority-high/90",
  medium: "bg-priority-medium text-white hover:bg-priority-medium/90",
  low: "bg-priority-low text-white hover:bg-priority-low/90",
};

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<TodoPriority | undefined>();
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [showPriority, setShowPriority] = useState(false);

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim(), priority, dueDate?.toISOString());
      setInput("");
      setPriority(undefined);
      setDueDate(undefined);
      setShowPriority(false);
    }
  };

  return (
    <div className="space-y-3 mb-6 animate-fade-in">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="What needs to be done?"
          className="flex-1 h-14 px-6 text-lg bg-card border-border focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <Button
          onClick={handleAdd}
          size="lg"
          className="h-14 px-6 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={showPriority ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPriority(!showPriority)}
          className={cn(
            "gap-2",
            showPriority && "bg-primary hover:bg-primary/90"
          )}
        >
          <Flag className="w-4 h-4" />
          Priority
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={dueDate ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-2",
                dueDate && "bg-primary hover:bg-primary/90"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
              {dueDate ? format(dueDate, "MMM d") : "Due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {(priority || dueDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPriority(undefined);
              setDueDate(undefined);
              setShowPriority(false);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {showPriority && (
        <div className="flex gap-2 animate-fade-in">
          {priorities.map((p) => (
            <Button
              key={p}
              variant={priority === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPriority(p)}
              className={cn(
                "capitalize",
                priority === p && priorityColors[p]
              )}
            >
              {p}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
