
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Program } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program | null;
}

const ProgramDetailsModal: React.FC<Props> = ({ open, onOpenChange, program }) => {
  if (!program) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Program Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div><strong>ID:</strong> {program.id}</div>
          <div><strong>Title:</strong> {program.title}</div>
          <div><strong>Description:</strong> {program.description}</div>
          <div><strong>Start Date:</strong> {program.start_date}</div>
          <div><strong>End Date:</strong> {program.end_date}</div>
          <div><strong>Status:</strong> {program.status}</div>
          <div><strong>Activity:</strong> {program.activite}</div>
          <div><strong>Type:</strong> {program.type_activite}</div>
          <div><strong>Organizer:</strong> {program.organizer_name}</div>
          <div><strong>Phase:</strong> {program.phase?.name}</div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default ProgramDetailsModal;
