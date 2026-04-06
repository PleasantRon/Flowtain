import { useCallback, useState } from "react";
import { useTaskWorkspace } from "../../context/TaskContext.jsx";
import { TaskItemView } from "./TaskItemView.jsx";

export function TaskItem({ task }) {
  const { updateTaskTitle, toggleTask, deleteTask } = useTaskWorkspace();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const onSaveEdit = useCallback(() => {
    const t = draft.trim();
    if (t) updateTaskTitle(task.id, t);
    else setDraft(task.title);
    setEditing(false);
  }, [draft, task.id, task.title, updateTaskTitle]);

  const onEditKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") onSaveEdit();
      if (e.key === "Escape") {
        setDraft(task.title);
        setEditing(false);
      }
    },
    [onSaveEdit, task.title]
  );

  return (
    <TaskItemView
      task={task}
      editing={editing}
      draftTitle={draft}
      onDraftChange={setDraft}
      onSaveEdit={onSaveEdit}
      onEditKeyDown={onEditKeyDown}
      onStartEdit={() => setEditing(true)}
      onToggle={() => toggleTask(task.id)}
      onDelete={() => deleteTask(task.id)}
    />
  );
}
