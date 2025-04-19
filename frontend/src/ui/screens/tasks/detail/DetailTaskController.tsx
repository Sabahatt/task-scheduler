import React, { useEffect, useState } from "react";
import DetailTaskView from "./DetailTaskView";
import { ITask } from "@/models/types/Task";
import { toast } from "react-toastify";
import { getTaskById, updateTask } from "@/services/TaskService";
import { useParams } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material/Select";

type TaskStatus = "" | "Pending" | "In Progress" | "Completed";

const DetailTaskController = () => {
  const { id } = useParams();
  const [taskData, setTaskData] = useState<ITask>();
  const [loading, setLoading] = useState<boolean>(false);

  const getTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await getTaskById(id!);
      setTaskData(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch member details.");
      console.error("Failed to fetch member details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTaskDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (event: SelectChangeEvent) => {
    const newStatus = event.target.value as TaskStatus;
    try {
      setLoading(true);

      await updateTask(taskData._id, { status: newStatus });
      toast.success("Task status updated!");
      getTaskDetails();
    } catch (error) {
      toast.error("Failed to update task status.");
      console.error("Failed to update task status", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DetailTaskView
      loading={loading}
      taskData={taskData}
      handleStatusUpdate={handleStatusChange}
    />
  );
};

export default DetailTaskController;
