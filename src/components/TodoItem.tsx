import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 300);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 rounded-xl bg-card border border-border",
        "transition-all duration-300 hover:shadow-md",
        "animate-scale-in",
        isDeleting && "animate-fade-out"
      )}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300",
          "flex items-center justify-center",
          todo.completed
            ? "bg-gradient-to-br from-primary to-primary-glow border-primary"
            : "border-muted-foreground/30 hover:border-primary hover:scale-110"
        )}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && (
          <Check className="w-4 h-4 text-primary-foreground animate-scale-in" />
        )}
      </button>

      <span
        className={cn(
          "flex-1 text-foreground transition-all duration-300",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.text}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
        aria-label="Delete todo"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
