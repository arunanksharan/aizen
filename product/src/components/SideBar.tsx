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
import { useCreatePostContext } from '@/store/CreatePostContext';

const SideBar: React.FC = () => {
  const { creationStarted, setCreationStarted } = useCreatePostContext();

  const createHandler = () => {
    console.log('Create button clicked');
    setCreationStarted(true);
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
