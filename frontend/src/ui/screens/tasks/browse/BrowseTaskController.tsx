import React, { useEffect, useState } from "react";
import BrowseTaskView from "./BrowseTaskView";
import { deleteTask, getAllTasks } from "@/services/TaskService";
import { ITask } from "@/models/types/Task";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BrowseTaskController = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ITask[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getAllTasks();
      setTasks(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteTask(id);
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Failed to delete task", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    navigate("/tasks/add");
  };

  const handleEditTask = (id: string) => {
    navigate(`/task/edit/${id}`);
  };

  const rows = tasks.map((task) => ({
    id: task._id,
    ...task,
  }));

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <BrowseTaskView
      loading={loading}
      rows={rows}
      handleDelete={handleDelete}
      handleCreate={handleCreateTask}
      handleEdit={handleEditTask}
    />
  );
};

export default BrowseTaskController;
