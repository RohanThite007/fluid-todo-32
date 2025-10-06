import { useState } from "react";
import { Check, Trash2, Edit2, Save, X, Calendar, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type TodoPriority = "high" | "medium" | "low";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: TodoPriority;
  dueDate?: string;
};

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

const priorityColors = {
  high: "border-l-priority-high",
  medium: "border-l-priority-medium",
  low: "border-l-priority-low",
};

const priorityBadgeColors = {
  high: "bg-priority-high/10 text-priority-high border-priority-high/20",
  medium: "bg-priority-medium/10 text-priority-medium border-priority-medium/20",
  low: "bg-priority-low/10 text-priority-low border-priority-low/20",
};

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 300);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-4 rounded-xl bg-card border-l-4",
        "transition-all duration-300 hover:shadow-md border-t border-r border-b border-border",
        "animate-scale-in",
        isDeleting && "animate-fade-out",
        todo.priority ? priorityColors[todo.priority] : "border-l-border"
      )}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 mt-1",
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

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="flex-1 h-9"
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              className="h-9 w-9 hover:bg-success/10 hover:text-success"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancel}
              className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 flex-wrap">
              <span
                className={cn(
                  "flex-1 text-foreground transition-all duration-300 break-words",
                  todo.completed && "line-through text-muted-foreground"
                )}
              >
                {todo.text}
              </span>
              {todo.priority && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                    priorityBadgeColors[todo.priority]
                  )}
                >
                  <Flag className="w-3 h-3" />
                  {todo.priority}
                </span>
              )}
            </div>
            {todo.dueDate && (
              <div
                className={cn(
                  "flex items-center gap-1 mt-2 text-xs",
                  isOverdue
                    ? "text-destructive font-medium"
                    : todo.completed
                    ? "text-muted-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Calendar className="w-3 h-3" />
                {isOverdue && !todo.completed ? "Overdue: " : "Due: "}
                {format(new Date(todo.dueDate), "MMM d, yyyy")}
              </div>
            )}
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            aria-label="Edit todo"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete todo"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
