import React, { useEffect, useState } from "react";
import DetailMemberView from "./DetailMemberView";
import { useNavigate, useParams } from "react-router-dom";
import { getMemberById } from "@/services/MemberService";
import { toast } from "react-toastify";
import { IMember } from "@/models/types/Member";
import { ITask } from "@/models/types/Task";

const DetailMemberController = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [memberData, setMemberData] = useState<{
    member: IMember;
    tasks: ITask[];
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMemberDetails = async () => {
      try {
        setLoading(true);
        const response = await getMemberById(id!);
        setMemberData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch member details.");
        console.error("Failed to fetch member details", error);
      } finally {
        setLoading(false);
      }
    };
    getMemberDetails();
  }, [id]);

  const groupedTasks = memberData?.tasks.reduce((acc, task) => {
    (acc[task.status] ||= []).push(task);
    return acc;
  }, {} as Record<string, ITask[]>);

  const handleViewDetail = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <DetailMemberView
      loading={loading}
      memberData={{
        memberName: memberData?.member?.memberName,
        availableHours: memberData?.member?.availableHours,
      }}
      groupedTasks={groupedTasks}
      handleViewDetail={handleViewDetail}
    />
  );
};

export default DetailMemberController;
