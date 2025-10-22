import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, isAuthenticated, signOut } = useAuth();

  // Filter out Gamify for MNC users
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/devices", label: "Devices" },
    ...(profile?.user_type !== 'mnc' ? [{ path: "/gamify", label: "Gamify" }] : []),
    { path: "/offset", label: "Offset" },
    { path: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Don't show navigation on landing page for non-authenticated users
  if (!isAuthenticated && location.pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary/10 emerald-glow">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <span className="font-orbitron font-bold text-xl text-foreground">
              Carbon Trackr
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-primary active"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     <Avatar className="h-10 w-10 border-2 border-primary/20">
                       <AvatarFallback className="bg-primary/10 text-primary">
                         {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                       </AvatarFallback>
                     </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                   <div className="flex items-center justify-start gap-2 p-2">
                     <div className="flex flex-col space-y-1 leading-none">
                       <p className="font-medium">{profile?.full_name || profile?.company_name || 'User'}</p>
                       <p className="w-[200px] truncate text-sm text-muted-foreground">
                         {user?.email}
                       </p>
                     </div>
                   </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                     <LogOut className="mr-2 h-4 w-4" />
                     Sign out
                   </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button className="emerald-glow gradient-bg font-semibold" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/50 backdrop-blur-sm rounded-lg mt-2 border border-border">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5">
                     <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-primary/10 text-primary text-xs">
                         {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                       <p className="text-sm font-medium">{profile?.full_name || profile?.company_name || 'User'}</p>
                       <p className="text-xs text-muted-foreground">{user?.email}</p>
                     </div>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={handleLogout}
                       className="text-xs"
                     >
                       Sign Out
                     </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button className="w-full emerald-glow gradient-bg font-semibold" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;