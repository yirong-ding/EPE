import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Leaf, User, MessageSquare, Home } from "lucide-react";

interface NavigationProps {
  onAccountClick?: () => void;
  onForumClick?: () => void;
  onHomeClick?: () => void;
  showAccount?: boolean;
  showForum?: boolean;
  showHome?: boolean;
  currentPage?: string;
}

export function Navigation({
  onAccountClick,
  onForumClick,
  onHomeClick,
  showAccount = true,
  showForum = true,
  showHome = false,
  currentPage = "home"
}: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">EPE Platform</h2>
            <p className="text-xs text-muted-foreground">Environmental Protection Education</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showHome && onHomeClick && (
            <Button
              variant={currentPage === "home" ? "default" : "ghost"}
              size="sm"
              onClick={onHomeClick}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          )}
          {showForum && onForumClick && (
            <Button
              variant={currentPage === "forum" ? "default" : "ghost"}
              size="sm"
              onClick={onForumClick}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Forum</span>
            </Button>
          )}
          {showAccount && onAccountClick && (
            <Button
              variant={currentPage === "account" ? "default" : "ghost"}
              size="sm"
              onClick={onAccountClick}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
