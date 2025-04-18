import ScreenHeader from "@/ui/components/ScreenHeader";
import MemberForm from "@/ui/components/MemberForm";
import React, { FC } from "react";

type Props = {
  loading: boolean;
  handleCreate
};

const CreateMemberView: FC<Props> = ({loading, handleCreate}) => {
  return (
    <div className="container">
      <ScreenHeader title="Create Member" />
      <MemberForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
};

export default CreateMemberView;
