"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

export function UniversityFilters() {
    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Search</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9 h-10" placeholder="University name..." />
                </div>
            </div>

            {/* City */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">City</Label>
                <Select>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        <SelectItem value="beijing">Beijing</SelectItem>
                        <SelectItem value="shanghai">Shanghai</SelectItem>
                        <SelectItem value="hangzhou">Hangzhou</SelectItem>
                        <SelectItem value="wuhan">Wuhan</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Type */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">University Type</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="985" />
                        <Label htmlFor="985" className="font-normal text-sm cursor-pointer">Project 985</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="211" />
                        <Label htmlFor="211" className="font-normal text-sm cursor-pointer">Project 211</Label>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">Features</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="scholarships" />
                        <Label htmlFor="scholarships" className="font-normal text-sm cursor-pointer">Scholarships</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="english" />
                        <Label htmlFor="english" className="font-normal text-sm cursor-pointer">English Programs</Label>
                    </div>
                </div>
            </div>
        </div>
    );
}
