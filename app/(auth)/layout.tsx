import {ReactNode} from 'react'
import "../globals.css";
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { Card, CardContent } from '@/components/ui/card';

const Authlayout = async ({children}: {children: ReactNode}) => {
  // Force revalidation of authentication status
  const user = await getCurrentUser();
  console.log("Auth layout - user authenticated:", !!user);
  
  if(user?.portal === "industry") redirect("/industry");
  if(user?.portal === "college") redirect("/college");
  if(user) redirect('/');
  
  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <Card className="w-full max-w-xl">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export default Authlayout
