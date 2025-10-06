import { useState, useEffect, useMemo } from "react";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TodoItem, type Todo, type TodoPriority } from "./TodoItem";
import { TodoStats } from "./TodoStats";
import { AddTodoForm } from "./AddTodoForm";
import { ThemeToggle } from "./ThemeToggle";
import { toast } from "@/hooks/use-toast";
type Filter = "all" | "active" | "completed";
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
  const addTodo = (text: string, priority?: TodoPriority, dueDate?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      dueDate
    };
    setTodos([newTodo, ...todos]);
    toast({
      title: "Task added",
      description: "Your new task has been added successfully."
    });
  };
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        if (completed) {
          toast({
            title: "Task completed! 🎉",
            description: "Great job on finishing this task!"
          });
        }
        return {
          ...todo,
          completed
        };
      }
      return todo;
    }));
  };
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed."
    });
  };
  const editTodo = (id: string, text: string) => {
    setTodos(todos.map(todo => todo.id === id ? {
      ...todo,
      text
    } : todo));
    toast({
      title: "Task updated",
      description: "Your changes have been saved."
    });
  };
  const clearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
      toast({
        title: "No completed tasks",
        description: "There are no completed tasks to clear."
      });
      return;
    }
    setTodos(todos.filter(todo => !todo.completed));
    toast({
      title: "Completed tasks cleared",
      description: `Removed ${completedCount} completed task${completedCount > 1 ? "s" : ""}.`
    });
  };
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply filter
    if (filter === "active") filtered = filtered.filter(t => !t.completed);
    if (filter === "completed") filtered = filtered.filter(t => t.completed);

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [todos, filter, searchQuery]);
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;
  return <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Aspire</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Stay organized and productive
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Statistics */}
        <TodoStats total={todos.length} active={activeCount} completed={completedCount} />

        {/* Add Todo Form */}
        <AddTodoForm onAdd={addTodo} />

        {/* Search */}
        <div className="mb-4 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tasks..." className="pl-12 h-12 bg-card border-border" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
          {(["all", "active", "completed"] as Filter[]).map(f => <Button key={f} variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} size="sm" className={filter === f ? "bg-gradient-to-r from-primary to-primary-glow hover:opacity-90" : ""}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>)}

          {completedCount > 0 && <Button variant="ghost" onClick={clearCompleted} size="sm" className="ml-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear completed
            </Button>}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? <div className="text-center py-12 text-muted-foreground animate-fade-in">
              <p className="text-lg">
                {searchQuery ? "No tasks match your search." : filter === "all" ? "No tasks yet. Add one to get started!" : filter === "active" ? "No active tasks. Great job! 🎉" : "No completed tasks yet."}
              </p>
            </div> : filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />)}
        </div>
      </div>
    </div>;
}