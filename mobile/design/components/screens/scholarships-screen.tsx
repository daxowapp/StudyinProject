import { Card } from "@/components/ui/card"
import { Award, Calendar, DollarSign, ChevronRight, Clock, CheckCircle2 } from "lucide-react"

export function ScholarshipsScreen() {
  const featuredScholarships = [
    {
      id: 1,
      name: "CSC Scholarship",
      type: "Full Scholarship",
      coverage: "Full tuition + living",
      deadline: "Mar 15, 2025",
      status: "Open",
    },
    {
      id: 2,
      name: "Provincial Government",
      type: "Partial Scholarship",
      coverage: "Tuition waiver",
      deadline: "Apr 30, 2025",
      status: "Open",
    },
  ]

  const allScholarships = [
    {
      id: 3,
      name: "Confucius Institute",
      amount: "$5,000/year",
      eligibility: "Language students",
      deadline: "Feb 28, 2025",
    },
    {
      id: 4,
      name: "Belt & Road Initiative",
      amount: "Full coverage",
      eligibility: "B&R countries",
      deadline: "Mar 31, 2025",
    },
    {
      id: 5,
      name: "University Merit Award",
      amount: "$3,000/year",
      eligibility: "Top academic record",
      deadline: "Rolling",
    },
    {
      id: 6,
      name: "STEM Excellence Grant",
      amount: "$4,500/year",
      eligibility: "STEM programs",
      deadline: "Apr 15, 2025",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-[2rem]">
        <h1 className="text-primary-foreground text-lg font-bold mb-2">Scholarships</h1>
        <p className="text-primary-foreground/80 text-sm">Over $2M+ in scholarships available</p>
      </div>

      {/* Stats */}
      <div className="px-5 -mt-4">
        <Card className="bg-card shadow-lg border-0 p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-foreground font-bold text-lg">150+</p>
              <p className="text-muted-foreground text-xs">Scholarships</p>
            </div>
            <div>
              <p className="text-foreground font-bold text-lg">$2M+</p>
              <p className="text-muted-foreground text-xs">Total Value</p>
            </div>
            <div>
              <p className="text-foreground font-bold text-lg">98%</p>
              <p className="text-muted-foreground text-xs">Success Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Scholarships */}
      <div className="px-5 py-5">
        <h2 className="text-foreground font-semibold mb-3">Featured Opportunities</h2>
        <div className="space-y-3">
          {featuredScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              className="p-4 border-0 shadow-md bg-gradient-to-r from-primary/5 to-accent/5 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-foreground font-semibold text-sm">{scholarship.name}</h3>
                      <p className="text-primary text-xs font-medium">{scholarship.type}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {scholarship.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> {scholarship.coverage}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <Calendar className="w-3 h-3" /> {scholarship.deadline}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Scholarships */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-semibold">All Scholarships</h2>
          <button className="text-primary text-xs font-medium">View All</button>
        </div>

        <div className="space-y-2">
          {allScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              className="p-3 border-0 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground font-medium text-sm">{scholarship.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="text-primary font-medium">{scholarship.amount}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {scholarship.deadline}
                  </span>
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
