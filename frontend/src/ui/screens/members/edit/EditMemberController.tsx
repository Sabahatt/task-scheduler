import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MemberFormValues } from "@/ui/components/MemberForm";
import { getMemberById, updateMember } from "@/services/MemberService";
import { toast } from "react-toastify";
import EditMemberView from "./EditMemberView";

const EditMemberController = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [memberData, setMemberData] = useState<Partial<MemberFormValues>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMemberDetails = async () => {
      try {
        setLoading(true);
        const response = await getMemberById(id!);
        const transformedData = {
            memberName: response.data.data.member.memberName,
            availableHours: response.data.data.member.availableHours,
          };
    
          setMemberData(transformedData);
      } catch (error) {
        toast.error("Failed to fetch member details.");
        console.error("Failed to fetch member details", error);
      } finally {
        setLoading(false);
      }
    };
    getMemberDetails();
  }, [id]);

  const handleSubmit = async (form: MemberFormValues) => {
    try {
      setLoading(true);
      await updateMember(id!, form); 
      toast.success("Member updated successfully!");
      navigate("/members"); 
    } catch (error) {
      toast.error("Failed to update member.");
      console.error("Failed to update member", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditMemberView
      loading={loading}
      onSubmit={handleSubmit}
      memberData={memberData}
    />
  );
};

export default EditMemberController;
