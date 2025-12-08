"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Sparkles } from "lucide-react"

interface ChatAdvisorProps {
  onClose: () => void
}

export function ChatAdvisor({ onClose }: ChatAdvisorProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hi there! 👋 I'm Chen Wei (陈伟), your personal study advisor. I'm here to help you find the perfect program in China. What brings you here today?",
    },
  ])

  const quickReplies = ["Find Programs", "Scholarships", "Start Application"]

  const handleSend = () => {
    if (!message.trim()) return
    setMessages([...messages, { id: Date.now(), type: "user", content: message }])
    setMessage("")
    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content:
            "That's great! I can help you with that. Could you tell me what field of study you're interested in and your preferred location in China?",
        },
      ])
    }, 1000)
  }

  return (
    <div className="absolute inset-0 bg-background z-40 flex flex-col">
      {/* Header */}
      <div className="bg-primary px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-primary-foreground font-semibold text-sm">Chen Wei 陈伟</h3>
          <p className="text-primary-foreground/80 text-xs">Your Study Advisor</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.type === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => setMessage(reply)}
              className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full border-muted"
          />
          <Button size="icon" onClick={handleSend} className="rounded-full bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
