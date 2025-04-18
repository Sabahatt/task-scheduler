import React, { useState } from 'react'
import CreateMemberView from './CreateMemberView';
import { useNavigate } from 'react-router-dom';
import { createMember } from '@/services/MemberService';
import { toast } from 'react-toastify';

const CreateMemberController = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      await createMember(form);
      toast.success("Member created!");
      navigate("/members");
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Failed to create task", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CreateMemberView handleCreate={handleCreate} loading={loading}/>
  )
}

export default CreateMemberController