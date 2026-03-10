"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { bulkUpdateProgramsCsca } from "../../programs/actions";
import { toast } from "sonner";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Program {
    id: string;
    display_title: string;
    csca_exam_require?: boolean;
}

interface BulkCscaExamButtonProps {
    programs: Program[];
}

export function BulkCscaExamButton({ programs }: BulkCscaExamButtonProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Initialize standard values accurately by polling existing config state
    const [selectedProgramIds, setSelectedProgramIds] = useState<Set<string>>(
        new Set(programs.filter(p => p.csca_exam_require).map(p => p.id))
    );
    const router = useRouter();

    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            setSelectedProgramIds(new Set(programs.map(p => p.id)));
        } else {
            setSelectedProgramIds(new Set());
        }
    };

    const handleToggleProgram = (id: string, checked: boolean) => {
        const newSet = new Set(selectedProgramIds);
        if (checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        setSelectedProgramIds(newSet);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Unset all first
            const unselectedIds = programs
                .filter(p => !selectedProgramIds.has(p.id))
                .map(p => p.id);
                
            if (unselectedIds.length > 0) {
                await bulkUpdateProgramsCsca(unselectedIds, false);
            }
            
            // Set all selected
            const selectedArray = Array.from(selectedProgramIds);
            if (selectedArray.length > 0) {
                 await bulkUpdateProgramsCsca(selectedArray, true);
            }
            
            toast.success("CSCA Exam requirements updated successfully");
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update requirements");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (val) {
                // reset state on open
                setSelectedProgramIds(new Set(programs.filter(p => p.csca_exam_require).map(p => p.id)));
            }
            setOpen(val);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Bulk Edit CSCA
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Bulk Update CSCA Exam Requirements</DialogTitle>
                    <DialogDescription>
                        Select which programs require the CSCA Exam for admission.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4 py-4 space-y-4">
                    <div className="flex items-center space-x-2 pb-4 border-b">
                        <Checkbox 
                            id="select-all" 
                            checked={selectedProgramIds.size === programs.length && programs.length > 0}
                            onCheckedChange={(checked) => handleToggleAll(checked as boolean)}
                        />
                        <Label htmlFor="select-all" className="font-bold">Select All Programs</Label>
                    </div>
                    
                    <div className="grid gap-2">
                        {programs.map((program) => (
                            <div key={program.id} className="flex items-center space-x-2 py-1">
                                <Checkbox 
                                    id={`prog-${program.id}`} 
                                    checked={selectedProgramIds.has(program.id)}
                                    onCheckedChange={(checked) => handleToggleProgram(program.id, checked as boolean)}
                                />
                                <Label htmlFor={`prog-${program.id}`}>{program.display_title}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Requirements
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
