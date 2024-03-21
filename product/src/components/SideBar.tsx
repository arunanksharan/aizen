'use client';
import React from 'react';
import SideBarElement from './SideBarElement';
import {
  Home as HomeIcon,
  Search,
  Globe,
  Bell as NotificationIcon,
  PlusSquare,
  User,
} from 'react-feather';

const SideBar: React.FC = () => {
  const createHandler = () => {
    console.log('Create button clicked');
  };
  return (
    <div className="z-10">
      <SideBarElement Icon={HomeIcon} text="Home" />
      <SideBarElement Icon={Search} text="Search" />
      <SideBarElement Icon={Globe} text="Explore" />
      <SideBarElement Icon={NotificationIcon} text="Notification" />
      <SideBarElement
        Icon={PlusSquare}
        text="Create"
        onClickHandler={createHandler}
      />
      <SideBarElement Icon={User} text="Profile" />
    </div>
  );
};

export default SideBar;
