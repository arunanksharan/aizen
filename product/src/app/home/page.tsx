import Feed from '@/components/Feed';
import SideBar from '@/components/SideBar';
import Suggested from '@/components/Suggested';
import React from 'react';

export default function Home() {
  return (
    <div className="HomePageContainer flex flex-row justify-between min-w-full min-h-screen">
      <div className="fixed top-0 left-0 flex flex-col w-1/5 min-h-screen text-black border-r border-slate-300 bg-white">
        <div className="px-6 py-10 text-4xl text-black font-bold ">aizen</div>
        <SideBar></SideBar>
      </div>

      <div className="flex-1 pl-[20%]">
        <Feed></Feed>
      </div>
      <div className="w-1/5 bg-blue-200">
        <Suggested></Suggested>
      </div>
    </div>
  );
}
