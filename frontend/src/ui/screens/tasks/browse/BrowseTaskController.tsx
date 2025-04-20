import React, { useEffect, useState } from "react";
import BrowseTaskView from "./BrowseTaskView";
import { deleteTask, getAllTasks, unassignTask } from "@/services/TaskService";
import { ITask } from "@/models/types/Task";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BrowseTaskController = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ITask[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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

  const handleUnassign = async (id: string) => {
    setLoading(true);
    try {
      await unassignTask(id);
      toast.success("Unassigned successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to unassign");
      console.error("Failed to unassign", error);
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

  const handleViewDetail = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  const handleOpenModal = (taskId) => {
    setSelectedTaskId(taskId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTaskId(null);
  };

  const rows = tasks.map((task) => ({
    id: task._id,
    ...task,
  }));

  useEffect(() => {
    fetchTasks();
  }, [open]);

  return (
    <BrowseTaskView
      loading={loading}
      rows={rows}
      handleDelete={handleDelete}
      handleCreate={handleCreateTask}
      handleEdit={handleEditTask}
      handleViewDetail={handleViewDetail}
      open={open}
      setOpen={setOpen}
      handleUnassign={handleUnassign}
      selectedTaskId={selectedTaskId}
      handleCloseModal={handleCloseModal}
      handleOpenModal={handleOpenModal}
    />
  );
};

export default BrowseTaskController;
