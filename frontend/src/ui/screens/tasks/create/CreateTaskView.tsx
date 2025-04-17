import ScreenHeader from "@/ui/components/ScreenHeader";
import TaskForm from "@/ui/components/TaskForm";
import React, { FC } from "react";

type Props = {
  loading: boolean;
  handleCreate
};

const AddTaskView: FC<Props> = ({loading, handleCreate}) => {
  return (
    <div className="container">
      <ScreenHeader title="Create Task" />
      <TaskForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
};

export default AddTaskView;
