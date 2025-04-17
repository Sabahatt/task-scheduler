import React, { useState } from 'react'
import AddTaskView from './CreateTaskView'
import { useNavigate } from 'react-router-dom';
import { createTask } from '@/services/TaskService';
import { toast } from 'react-toastify';

const AddTaskController = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      await createTask(form);
      toast.success("Task created!");
      navigate("/tasks");
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Failed to create task", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AddTaskView handleCreate={handleCreate} loading={loading}/>
  )
}

export default AddTaskController