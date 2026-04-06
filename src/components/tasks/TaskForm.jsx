import { useCallback, useState } from "react";
import { useTaskWorkspace } from "../../context/TaskContext.jsx";
import { TaskFormView } from "./TaskFormView.jsx";

export function TaskForm() {
  const { addTask } = useTaskWorkspace();
  const [title, setTitle] = useState("");

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;
      addTask(trimmed);
      setTitle("");
    },
    [addTask, title]
  );

  return <TaskFormView value={title} onChange={setTitle} onSubmit={onSubmit} />;
}
