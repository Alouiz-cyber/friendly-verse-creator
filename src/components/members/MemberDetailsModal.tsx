
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Member } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
}

const MemberDetailsModal: React.FC<Props> = ({ open, onOpenChange, member }) => {
  if (!member) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div><strong>ID:</strong> {member.id}</div>
          <div><strong>Name:</strong> {member.name}</div>
          <div><strong>Email:</strong> {member.email}</div>
          <div><strong>Role:</strong> {member.role}</div>
          <div><strong>Phone:</strong> {member.phone}</div>
          <div><strong>Gender:</strong> {member.gender}</div>
          <div><strong>CIN:</strong> {member.cin}</div>
          <div><strong>Certification:</strong> {member.certification}</div>
          <div><strong>Address:</strong> {member.address}</div>
          <div><strong>Status:</strong> {member.status}</div>
          <div><strong>Join Year:</strong> {member.join_year}</div>
          <div><strong>Created at:</strong> {member.created_at}</div>
          <div><strong>Updated at:</strong> {member.updated_at}</div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default MemberDetailsModal;
