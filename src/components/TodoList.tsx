import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TodoItem, type Todo } from "./TodoItem";
import { ThemeToggle } from "./ThemeToggle";
import { toast } from "@/hooks/use-toast";

type Filter = "all" | "active" | "completed";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) {
      toast({
        title: "Empty task",
        description: "Please enter a task before adding.",
        variant: "destructive",
      });
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInput("");
    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeCount} active · {completedCount} completed
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6 animate-fade-in">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 h-14 px-6 text-lg bg-card border-border focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button
            onClick={addTodo}
            size="lg"
            className="h-14 px-6 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 animate-fade-in">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? "bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                  : ""
              }
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              <p className="text-lg">
                {filter === "all" && "No tasks yet. Add one to get started!"}
                {filter === "active" && "No active tasks. Great job! 🎉"}
                {filter === "completed" && "No completed tasks yet."}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
