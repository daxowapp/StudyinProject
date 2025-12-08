"use client"
import { Card } from "@/components/ui/card"
import { MessageCircle, GraduationCap, Building2, Award, TrendingUp, ChevronRight, Sparkles } from "lucide-react"

interface HomeScreenProps {
  onOpenChat: () => void
}

export function HomeScreen({ onOpenChat }: HomeScreenProps) {
  const stats = [
    { label: "Universities", value: "500+", icon: Building2 },
    { label: "Students", value: "50K+", icon: GraduationCap },
    { label: "Success", value: "98%", icon: TrendingUp },
    { label: "Scholarships", value: "$2M+", icon: Award },
  ]

  const quickActions = [
    { label: "Find Programs", icon: GraduationCap, color: "bg-primary" },
    { label: "Universities", icon: Building2, color: "bg-accent" },
    { label: "Scholarships", icon: Award, color: "bg-secondary" },
  ]

  const featuredPrograms = [
    {
      title: "MBA Program",
      university: "Tsinghua University",
      location: "Beijing",
      image: "/tsinghua-university-campus.jpg",
    },
    {
      title: "Engineering",
      university: "Zhejiang University",
      location: "Hangzhou",
      image: "/zhejiang-university-campus.jpg",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-primary px-5 pt-4 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/80 text-sm">Welcome to</p>
            <h1 className="text-primary-foreground text-xl font-bold flex items-center gap-2">
              <span className="text-accent">Study</span>AtChina
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-xl">🎓</span>
          </div>
        </div>

        <p className="text-primary-foreground/90 text-sm leading-relaxed">
          Your gateway to world-class education in China. Join 50,000+ students achieving their dreams.
        </p>
      </div>

      {/* Stats Row */}
      <div className="px-5 -mt-5">
        <Card className="bg-card shadow-lg border-0 p-4">
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-bold text-sm">{stat.value}</span>
                  <span className="text-muted-foreground text-[10px]">{stat.label}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <h2 className="text-foreground font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                className={`${action.color} p-4 rounded-2xl flex flex-col items-center gap-2 transition-transform active:scale-95`}
              >
                <Icon className="w-6 h-6 text-primary-foreground" />
                <span className="text-primary-foreground text-xs font-medium">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* AI Advisor CTA */}
      <div className="px-5 mt-6">
        <Card
          className="bg-gradient-to-r from-primary to-primary/80 border-0 p-4 cursor-pointer transition-transform active:scale-[0.98]"
          onClick={onOpenChat}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-primary-foreground font-semibold">AI Study Advisor</h3>
              <p className="text-primary-foreground/80 text-xs">Get personalized program recommendations</p>
            </div>
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
        </Card>
      </div>

      {/* Featured Programs */}
      <div className="px-5 mt-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-semibold">Featured Programs</h2>
          <button className="text-primary text-xs font-medium flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {featuredPrograms.map((program) => (
            <Card key={program.title} className="flex-shrink-0 w-44 border-0 shadow-md overflow-hidden">
              <img src={program.image || "/placeholder.svg"} alt={program.title} className="w-full h-20 object-cover" />
              <div className="p-3">
                <h3 className="text-foreground font-semibold text-sm">{program.title}</h3>
                <p className="text-muted-foreground text-xs">{program.university}</p>
                <p className="text-primary text-[10px] mt-1">📍 {program.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
