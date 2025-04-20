import { getSummary } from "@/services/DashboardService";
import DashboardView from "./DashboardView";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ISummary } from "@/models/types/Summary";
import { ITask } from "@/models/types/Task";

const DashboardController = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ISummary>();
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [tasksToShow, setTasksToShow] = useState<ITask[]>([]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await getSummary();
      setData(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch members");
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const openModal = (title: string, tasks: ITask[]) => {
    setModalTitle(title);
    setTasksToShow(tasks);
    setOpen(true);
  };

  const handleRowClick = (params) => {
    navigate(`/tasks/${params.row._id}`);
  };

  const handleBtnClick = () => {
    navigate("/tasks/add");
  };

  return (
    <DashboardView
      data={data}
      loading={loading}
      open={open}
      setOpen={setOpen}
      openModal={openModal}
      handleRowClick={handleRowClick}
      modalTitle={modalTitle}
      tasksToShow={tasksToShow}
      handleBtnClick={handleBtnClick}
    />
  );
};

export default DashboardController;
