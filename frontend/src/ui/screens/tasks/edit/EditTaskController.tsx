import React, { useEffect, useState } from "react";
import EditTaskView from "./EditTaskView";
import { useNavigate, useParams } from "react-router-dom";
import { TaskFormValues } from "@/ui/components/TaskForm";
import { getTaskById, updateTask } from "@/services/TaskService";
import { toast } from "react-toastify";

const EditTaskController = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [taskData, setTaskData] = useState<Partial<TaskFormValues>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        setLoading(true);
        const response = await getTaskById(id!); 
        setTaskData(response.data.data); 
      } catch (error) {
        toast.error("Failed to fetch task details.");
        console.error("Failed to fetch task details", error);
      } finally {
        setLoading(false);
      }
    };
    getTaskDetails();
  }, [id]);

  const handleSubmit = async (form: TaskFormValues) => {
    try {
      setLoading(true);
      await updateTask(id!, form); 
      toast.success("Task updated successfully!");
      navigate("/tasks"); 
    } catch (error) {
      toast.error("Failed to update task.");
      console.error("Failed to update task", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditTaskView
      loading={loading}
      onSubmit={handleSubmit}
      taskData={taskData}
    />
  );
};

export default EditTaskController;
