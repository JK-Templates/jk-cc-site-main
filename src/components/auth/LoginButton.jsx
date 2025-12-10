import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LoginButton() {
  const { user, isAdmin, login, logout } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => login(tokenResponse),
    onError: () => console.log('Login Failed'),
  });

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
            <Avatar className="h-10 w-10 border-2 border-amber-500/50">
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback className="bg-slate-800 text-slate-200">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border-2 border-slate-950">
                <Shield className="w-2.5 h-2.5 text-slate-950" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-slate-950 border-slate-800 text-slate-200" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-slate-500">{user.email}</p>
              {isAdmin && (
                <div className="flex items-center gap-1 text-amber-500 text-xs mt-1 font-medium">
                  <Shield className="w-3 h-3" />
                  <span>מנהל מערכת</span>
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-800" />
          <DropdownMenuItem 
            onClick={logout}
            className="text-red-400 focus:bg-slate-900 focus:text-red-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            התנתק
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
        onClick={() => handleGoogleLogin()}
        variant="outline" 
        className="gap-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white"
    >
      <LogIn className="w-4 h-4" />
      <span>התחבר</span>
    </Button>
  );
}