import React from 'react';
import { createClient } from '../lib/utils/supabase/serverClient';
import { redirect } from 'next/navigation';
import Feed from '../ui/components/Feed';
import Suggested from '../ui/components/Suggested';
import SideBar from '../ui/components/SideBar';
import HomeFeed from '../ui/components/HomeFeed';
import { Providers } from '@/app/lib/providers/Providers';

const Home = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/');
  }

  return <HomeFeed></HomeFeed>;
};

export default Home;
