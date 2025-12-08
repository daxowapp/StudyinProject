"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, MapPin, Clock, DollarSign } from "lucide-react"

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  const filters = [
    { id: "all", label: "All" },
    { id: "bachelor", label: "Bachelor" },
    { id: "master", label: "Master" },
    { id: "phd", label: "PhD" },
    { id: "mba", label: "MBA" },
  ]

  const programs = [
    {
      id: 1,
      title: "Computer Science",
      degree: "Bachelor",
      university: "Peking University",
      location: "Beijing",
      duration: "4 years",
      tuition: "$4,500/year",
      image: "/peking-university-logo.jpg",
    },
    {
      id: 2,
      title: "International Business",
      degree: "Master",
      university: "Fudan University",
      location: "Shanghai",
      duration: "2 years",
      tuition: "$6,000/year",
      image: "/fudan-university-logo.jpg",
    },
    {
      id: 3,
      title: "Medicine (MBBS)",
      degree: "Bachelor",
      university: "Wuhan University",
      location: "Wuhan",
      duration: "6 years",
      tuition: "$5,200/year",
      image: "/wuhan-university-logo.jpg",
    },
    {
      id: 4,
      title: "Mechanical Engineering",
      degree: "Master",
      university: "Shanghai Jiao Tong",
      location: "Shanghai",
      duration: "2.5 years",
      tuition: "$5,500/year",
      image: "/shanghai-jiao-tong-university-logo.jpg",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-[2rem]">
        <h1 className="text-primary-foreground text-lg font-bold mb-4">Find Programs</h1>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-0 rounded-xl h-11"
            />
          </div>
          <Button size="icon" variant="secondary" className="h-11 w-11 rounded-xl">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-5 pb-6">
        <p className="text-muted-foreground text-sm mb-3">
          Showing <span className="text-foreground font-semibold">500+</span> programs
        </p>

        <div className="space-y-3">
          {programs.map((program) => (
            <Card key={program.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex gap-3">
                <img
                  src={program.image || "/placeholder.svg"}
                  alt={program.university}
                  className="w-14 h-14 rounded-xl object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-foreground font-semibold text-sm">{program.title}</h3>
                      <p className="text-muted-foreground text-xs">{program.university}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                      {program.degree}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {program.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {program.duration}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <DollarSign className="w-3 h-3" /> {program.tuition}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
