"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, ChevronRight } from "lucide-react"

export function UniversitiesScreen() {
  const [searchQuery, setSearchQuery] = useState("")

  const featuredUniversities = [
    {
      id: 1,
      name: "Tsinghua University",
      location: "Beijing",
      ranking: "#1 in China",
      students: "50,000+",
      rating: 4.9,
      image: "/tsinghua-university-campus-beautiful.jpg",
    },
    {
      id: 2,
      name: "Peking University",
      location: "Beijing",
      ranking: "#2 in China",
      students: "45,000+",
      rating: 4.8,
      image: "/peking-university-campus-beautiful.jpg",
    },
  ]

  const allUniversities = [
    {
      id: 3,
      name: "Fudan University",
      location: "Shanghai",
      programs: 120,
      image: "/fudan-university-logo.jpg",
    },
    {
      id: 4,
      name: "Zhejiang University",
      location: "Hangzhou",
      programs: 115,
      image: "/zhejiang-university-logo.jpg",
    },
    {
      id: 5,
      name: "Shanghai Jiao Tong",
      location: "Shanghai",
      programs: 100,
      image: "/shanghai-jiao-tong-university-logo.jpg",
    },
    {
      id: 6,
      name: "Wuhan University",
      location: "Wuhan",
      programs: 95,
      image: "/wuhan-university-logo.jpg",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-[2rem]">
        <h1 className="text-primary-foreground text-lg font-bold mb-4">Universities</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search universities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-0 rounded-xl h-11"
          />
        </div>
      </div>

      {/* Featured Universities */}
      <div className="px-5 py-5">
        <h2 className="text-foreground font-semibold mb-3">Top Ranked</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {featuredUniversities.map((uni) => (
            <Card
              key={uni.id}
              className="flex-shrink-0 w-52 border-0 shadow-md overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
            >
              <img src={uni.image || "/placeholder.svg"} alt={uni.name} className="w-full h-24 object-cover" />
              <div className="p-3">
                <h3 className="text-foreground font-semibold text-sm">{uni.name}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  {uni.location}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary text-xs font-medium">{uni.ranking}</span>
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-medium">{uni.rating}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Universities */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-semibold">All Universities</h2>
          <span className="text-muted-foreground text-xs">500+ universities</span>
        </div>

        <div className="space-y-2">
          {allUniversities.map((uni) => (
            <Card
              key={uni.id}
              className="p-3 border-0 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              <img
                src={uni.image || "/placeholder.svg"}
                alt={uni.name}
                className="w-12 h-12 rounded-xl object-cover bg-muted"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground font-medium text-sm">{uni.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {uni.location}
                  </span>
                  <span>•</span>
                  <span>{uni.programs} programs</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
