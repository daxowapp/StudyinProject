import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  GraduationCap,
  Heart,
  Clock,
} from "lucide-react"

export function ProfileScreen() {
  const menuItems = [
    { icon: FileText, label: "My Applications", badge: "3" },
    { icon: Heart, label: "Saved Programs", badge: "12" },
    { icon: Clock, label: "Application History" },
    { icon: Bell, label: "Notifications", badge: "5" },
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Help & Support" },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-primary px-5 pt-4 pb-8 rounded-b-[2rem]">
        <h1 className="text-primary-foreground text-lg font-bold mb-4">Profile</h1>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-primary-foreground font-semibold text-lg">Guest User</h2>
            <p className="text-primary-foreground/80 text-sm">Sign in to track applications</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="px-5 -mt-4">
        <Card className="bg-card shadow-lg border-0 p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-foreground font-bold text-lg">3</p>
              <p className="text-muted-foreground text-xs">Applications</p>
            </div>
            <div>
              <p className="text-foreground font-bold text-lg">12</p>
              <p className="text-muted-foreground text-xs">Saved</p>
            </div>
            <div>
              <p className="text-foreground font-bold text-lg">1</p>
              <p className="text-muted-foreground text-xs">Accepted</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sign In CTA */}
      <div className="px-5 mt-5">
        <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-primary-foreground font-semibold text-sm">Create Account</h3>
              <p className="text-primary-foreground/80 text-xs">Track your applications & get updates</p>
            </div>
            <Button size="sm" variant="secondary" className="rounded-full">
              Sign Up
            </Button>
          </div>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="px-5 mt-5 pb-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <span className="flex-1 text-foreground text-sm font-medium text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )
          })}
        </div>

        {/* Logout */}
        <button className="w-full flex items-center gap-3 p-3 mt-4 rounded-xl hover:bg-destructive/10 transition-colors text-destructive">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="flex-1 text-sm font-medium text-left">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
