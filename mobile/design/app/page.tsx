"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { HomeScreen } from "@/components/screens/home-screen"
import { SearchScreen } from "@/components/screens/search-screen"
import { UniversitiesScreen } from "@/components/screens/universities-screen"
import { ScholarshipsScreen } from "@/components/screens/scholarships-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { ChatAdvisor } from "@/components/chat-advisor"

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [showChat, setShowChat] = useState(false)

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onOpenChat={() => setShowChat(true)} />
      case "search":
        return <SearchScreen />
      case "universities":
        return <UniversitiesScreen />
      case "scholarships":
        return <ScholarshipsScreen />
      case "profile":
        return <ProfileScreen />
      default:
        return <HomeScreen onOpenChat={() => setShowChat(true)} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-background rounded-[3rem] shadow-2xl border-[12px] border-foreground/90 overflow-hidden">
        {/* Status Bar */}
        <div className="h-12 bg-primary flex items-center justify-between px-6 pt-2">
          <span className="text-primary-foreground text-sm font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground">
                <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73s3.15.25 4.6.73v3.1c0 .4.23.74.56.9.98.49 1.87 1.12 2.67 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z" />
              </svg>
            </div>
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground">
                <path d="M2 22h20V2L2 22z" />
              </svg>
            </div>
            <div className="w-6 h-3 bg-primary-foreground rounded-sm relative">
              <div className="absolute right-0.5 top-0.5 bottom-0.5 left-1 bg-primary rounded-sm" />
            </div>
          </div>
        </div>

        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-foreground rounded-full z-50" />

        {/* Main Content */}
        <div className="h-[calc(100%-7rem)] overflow-y-auto">{renderScreen()}</div>

        {/* Chat Overlay */}
        {showChat && <ChatAdvisor onClose={() => setShowChat(false)} />}

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
