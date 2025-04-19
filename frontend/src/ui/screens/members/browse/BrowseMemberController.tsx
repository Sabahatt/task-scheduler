import React, { useEffect, useState } from "react";
import BrowseMemberView from "./BrowseMemberView";
import { deleteMember, getAllMembers } from "@/services/MemberService";
import { IMember } from "@/models/types/Member";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BrowseMemberController = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<IMember[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await getAllMembers();
      setMembers(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch members");
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteMember(id);
      toast.success("Member deleted successfully");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to delete member");
      console.error("Failed to delete member", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    navigate("/members/add");
  };

  const handleEditTask = (id: string) => {
    navigate(`/members/edit/${id}`);
  };

  const handleViewDetail = (id: string) => {
    navigate(`/members/${id}`);
  };

  const rows = members.map((member) => ({
    id: member._id,
    ...member,
  }));

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <BrowseMemberView
      loading={loading}
      rows={rows}
      handleDelete={handleDelete}
      handleCreate={handleCreateTask}
      handleEdit={handleEditTask}
      handleViewDetail={handleViewDetail}
    />
  );
};

export default BrowseMemberController;
