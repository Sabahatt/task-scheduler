import ScreenHeader from "@/ui/components/ScreenHeader";
import MemberForm, { MemberFormValues } from "@/ui/components/MemberForm";
import { FC } from "react";

type Props = {
  loading: boolean;
  memberData: Partial<MemberFormValues>
  onSubmit: (form: MemberFormValues) => void;
};

const EditMemberView: FC<Props> = ({ loading, memberData, onSubmit }) => {
    // console.log('first', memberData)
  return (
    <div className="container">
      <ScreenHeader title="Edit Task" />
      <MemberForm
        onSubmit={onSubmit}
        defaultValues={memberData}
        loading={loading}
        isEditMode={true}
      />
    </div>
  );
};

export default EditMemberView;
