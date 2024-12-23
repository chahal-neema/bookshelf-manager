import { useContext, useState } from 'react';
import { UserCircle, Library, BookPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from '@/lib/auth';
import { AuthContext } from '@/lib/auth';
import { AddBookDialog } from '@/components/books/AddBookDialog';
import { LoansDialog } from '@/components/loans/LoansDialog';
import { ProfileDialog } from '@/components/profile/ProfileDialog';

export function TopNav({ onBookAdded }: { onBookAdded: () => void }) {
  const { user } = useContext(AuthContext);
  const [showLoans, setShowLoans] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav className="border-b border-[#DFE1E6] bg-white shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center">
            <Library className="h-6 w-6 text-[#0052CC]" />
            <span className="ml-2 text-lg font-medium text-[#172B4D]">BookShelf</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <AddBookDialog onBookAdded={onBookAdded} />
            
            <Button 
              variant="confluence" 
              className="text-[#42526E] hover:text-[#0052CC] hover:bg-[#DEEBFF] rounded-[3px]"
              onClick={() => setShowLoans(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Loans
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="confluence" 
                  size="icon"
                  className="text-[#42526E] hover:text-[#0052CC] hover:bg-[#DEEBFF] rounded-[3px] ml-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-[#172B4D]">Signed in as</p>
                  <p className="text-sm text-[#42526E] truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-[#DFE1E6]" />
                <DropdownMenuItem 
                  onClick={() => setShowProfile(true)}
                  className="text-[#172B4D] hover:bg-[#F4F5F7] focus:bg-[#F4F5F7] focus:text-[#172B4D] cursor-pointer"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#DFE1E6]" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-[#DE350B] hover:bg-[#FFEBE6] focus:bg-[#FFEBE6] focus:text-[#DE350B] cursor-pointer"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <LoansDialog 
        open={showLoans} 
        onOpenChange={setShowLoans}
        onLoanUpdated={onBookAdded}
      />

      <ProfileDialog
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </nav>
  );
}