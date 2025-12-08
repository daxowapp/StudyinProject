"use client"

import { Home, Search, Building2, Award, User } from "lucide-react"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "universities", label: "Unis", icon: Building2 },
    { id: "scholarships", label: "Aid", icon: Award },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
            <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
