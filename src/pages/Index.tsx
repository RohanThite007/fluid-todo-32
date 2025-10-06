import { TodoList } from "@/components/TodoList";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Index = () => {
  return (
    <ThemeProvider>
      <TodoList />
    </ThemeProvider>
  );
};

export default Index;
