import {ReactNode} from 'react'
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.action';
import AppShell from '@/components/layout/AppShell';

const Rootlayout = async ({children}:{children: React.ReactNode}) => {
  const user = await getCurrentUser();
  console.log("Root layout - user authenticated:", !!user);
  
  if(!user) redirect('/sign-in');
  if(user.portal === "industry") redirect("/industry");
  if(user.portal === "college") redirect("/college");
  
  return (
    <AppShell>
      {children}
    </AppShell>
  )
}

export default Rootlayout
