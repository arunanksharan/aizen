'client component';
import React from 'react';

interface SideBarElementProps {
  Icon: React.ElementType; // This accepts a component
  text: string;
  onClickHandler?: () => void;
}

const SideBarElement: React.FC<SideBarElementProps> = ({
  Icon,
  text,
  onClickHandler,
}: SideBarElementProps) => {
  return (
    <div
      className="flex flex-row items-center hover:cursor-pointer hover:bg-slate-100 mx-4 my-5 px-2 py-3 hover:rounded-lg"
      onClick={onClickHandler}
    >
      <Icon size={28} className="mr-4" />
      <div className="text-l">{text}</div>
    </div>
  );
};

export default SideBarElement;
