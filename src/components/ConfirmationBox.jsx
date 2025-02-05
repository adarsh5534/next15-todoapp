import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmBox({open, setOpen, title, description, onConfirm, onCancel }) {

    const handleConfirm = () => {
        onConfirm?.(); // Call confirm function if provided
        setOpen(false);
    };

    const handleCancel = () => {
        onCancel?.(); // Call cancel function if provided
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title || "Are you sure?"}</DialogTitle>
                    <DialogDescription>{description || "This action cannot be undone."}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button variant="destructive" onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
