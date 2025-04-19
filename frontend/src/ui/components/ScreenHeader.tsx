import Button from "@mui/material/Button";
import React, { FC } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  btnTitle?: string;
  handleClick?: () => void;
  subHead1?: string | number;
  subHead1Value?: string | number;
  subHead2?: string;
  subHead2Value?: string;
};

const ScreenHeader: FC<Props> = ({ title, btnTitle, handleClick, subHead1, subHead2, subHead1Value, subHead2Value }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-center mb-3 px-3">
        <div className="flex flex-row justify-center items-center">
          <IoIosArrowBack
            className="stroke-gray-200 cursor-pointer mr-5"
            size={25}
            color="lightGray"
            onClick={() => navigate(-1)}
          />
          <h1>{title}</h1>
        </div>
        {subHead1 && <h1>{`${subHead1}: ${subHead1Value}hrs`}</h1>}
        {subHead2 && <h1>{`${subHead2}: ${subHead2Value}`}</h1>}
        {btnTitle && <Button onClick={handleClick}>{btnTitle}</Button>}
      </div>
      <hr className="mb-8 border border-gray-200 border-t border-t-[1px]" />
    </>
  );
};

export default ScreenHeader;
