import Button from "@mui/material/Button";
import React, { FC } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  btnTitle?: string;
  handleClick?: () => void;
};

const ScreenHeader: FC<Props> = ({ title, btnTitle, handleClick }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-center mb-3 px-3">
        <div className="flex flex-row justify-center items-center">
          <IoIosArrowBack
            className="stroke-gray cursor-pointer"
            size={25}
            onClick={() => navigate(-1)}
          />
          <h1 className="heading">{title}</h1>
        </div>
        {btnTitle && <Button onClick={handleClick}>{btnTitle}</Button>}
      </div>
      <hr className="mb-8" />
    </>
  );
};

export default ScreenHeader;
