import React from "react";

import "./Backdrop.scss";

type BackdropProps = {
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Backdrop: React.FC<BackdropProps> = ({ onClick }) => {
    return <div className="backdrop-component" onClick={onClick}></div>;
};

export default Backdrop;
