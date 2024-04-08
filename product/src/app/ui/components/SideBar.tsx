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
  LogOut,
} from 'react-feather';
import { useCreatePostContext } from '@/app/lib/store/CreatePostContext';
// import CreatePost from './CreatePost';
import PromptInput from './PromptInput';
import CreatePostModal from './CreatePostModal';

const SideBar: React.FC = () => {
  // const { creationStarted, setCreationStarted } = useCreatePostContext();
  const [creationStarted, setCreationStarted] = React.useState(false);

  const createHandler = () => {
    console.log('Create button clicked in SideBar');
    console.log('creationStarted in sidebar', creationStarted);
    setCreationStarted(true);
  };
  const closeModal = () => {
    setCreationStarted(false);
  };

  const logoutHandler = async () => {
    console.log('Logout button clicked in SideBar');
    // Call backend signOut API
    const response = await fetch('/api/signout', { method: 'GET' });
    if (response.ok) {
      // Redirect to home page after successful logout
      window.location.href = '/';
    } else {
      // Handle error or notify user
      console.error('Failed to log out');
    }
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
      <SideBarElement
        Icon={LogOut}
        text="Logout"
        onClickHandler={logoutHandler}
      />
      {/* {creationStarted && <div>Creation started</div>} */}
      {creationStarted && (
        <CreatePostModal isVisible={creationStarted} onClose={closeModal}>
          <div className="modal-content-container text-black flex flex-row items-center justify-center bg-white w-full h-full rounded-xl">
            <PromptInput closeModal={closeModal} />
          </div>
        </CreatePostModal>
      )}
    </div>
  );
};

export default SideBar;
