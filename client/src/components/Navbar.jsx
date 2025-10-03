
import { School } from 'lucide-react'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// Here We Are using Lucide React in this program
const user = true;
const Navbar = () => {
  return (
    <div className='h-16 dark:bg-[#0A0A0A] bg-white border b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
      <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
        <div className='flex items-center gap-2'>
          <School size={"30"} />
          <h1 className='hidden md:block font-extrabold text-2xl'>Moodle</h1>
        </div>
        {/* User icons and darkmode icon  */}
        <div>
          {
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      My Learning
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuItem>
                    Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : <div className='flex items-center gap-2'>
              <Button variant="outline">Login</Button>
              <Button>Sign Up</Button>
            </div>
          }
        </div>
      </div>
    </div >
  )
}

export default Navbar