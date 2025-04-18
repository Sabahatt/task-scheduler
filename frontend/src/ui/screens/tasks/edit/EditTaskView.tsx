import ScreenHeader from "@/ui/components/ScreenHeader";
import TaskForm, { TaskFormValues } from "@/ui/components/TaskForm";
import { FC } from "react";

type Props = {
  loading: boolean;
  taskData: Partial<TaskFormValues>
  onSubmit: (form: TaskFormValues) => void;
};

const EditTaskView: FC<Props> = ({ loading, taskData, onSubmit }) => {
  return (
    <div className="container">
      <ScreenHeader title="Edit Task" />
      <TaskForm
        onSubmit={onSubmit}
        defaultValues={taskData}
        loading={loading}
        isEditMode={true}
      />
    </div>
  );
};

export default EditTaskView;
