"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Bookmark,
  EyeOff,
  Flag,
  Pencil,
  Trash2,
  Pin,
  Lock,
  ShieldCheck,
  ShieldX,
  Ban,
  BellOff,
  Ellipsis,
  CheckCircle2,
  Tag,
  Link2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const reportReasons = ["Spam or self-promotion", "Harassment or bullying", "Sharing personal information", "Misinformation about visas or deadlines", "Breaks community rules", "Something else"];

export function ReportDialog({ open, onOpenChange, kind }: { open: boolean; onOpenChange: (o: boolean) => void; kind: "post" | "comment" }) {
  const [reason, setReason] = React.useState(reportReasons[0]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report this {kind}</DialogTitle>
          <DialogDescription>Reports are anonymous. Moderators review them within 24 hours.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={setReason} className="gap-1">
          {reportReasons.map((r) => (
            <Label key={r} className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 font-normal has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary-soft/50">
              <RadioGroupItem value={r} />
              {r}
            </Label>
          ))}
        </RadioGroup>
        {reason === "Something else" && <Textarea placeholder="Tell us more" />}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="ink"
            onClick={() => {
              onOpenChange(false);
              toast.success("Thanks for reporting", { description: "A moderator will take a look." });
            }}
          >
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type ContentActions = {
  onEdit?: () => void;
  onDelete?: () => void;
  onRemove?: () => void;
  onPin?: () => void;
  onLock?: () => void;
  pinned?: boolean;
  locked?: boolean;
};

export function ContentMenu({
  kind,
  isOwn,
  isMod,
  actions,
  author,
}: {
  kind: "post" | "comment";
  isOwn?: boolean;
  isMod?: boolean;
  actions?: ContentActions;
  author?: string;
}) {
  const [report, setReport] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [confirmBan, setConfirmBan] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="rounded-full text-muted-foreground hover:text-foreground"
            aria-label={`${kind} options`}
            onClick={(e) => e.preventDefault()}
          >
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
          {isOwn && (
            <>
              <DropdownMenuItem onSelect={actions?.onEdit}>
                <Pencil /> Edit {kind}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete(true)}>
                <Trash2 /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onSelect={() => toast("Saved", { description: `You can find this ${kind} in your profile.` })}>
            <Bookmark /> Save
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast("Link copied")}>
            <Link2 /> Copy link
          </DropdownMenuItem>
          {kind === "post" && (
            <DropdownMenuItem onSelect={() => toast("Post hidden", { description: "You won't see it in your feed." })}>
              <EyeOff /> Hide
            </DropdownMenuItem>
          )}
          {kind === "post" && isOwn && (
            <DropdownMenuItem onSelect={() => toast("Reply notifications off")}>
              <BellOff /> Turn off notifications
            </DropdownMenuItem>
          )}
          {!isOwn && (
            <>
              <DropdownMenuItem onSelect={() => toast(`Muted ${author ?? "member"}`)}>
                <VolumeX /> Mute {author ?? "member"}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setReport(true)}>
                <Flag /> Report
              </DropdownMenuItem>
            </>
          )}
          {isMod && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-1.5 normal-case tracking-normal">
                <ShieldCheck className="size-3.5 text-success" /> Mod tools
              </DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => toast.success("Approved")}>
                <CheckCircle2 /> Approve
              </DropdownMenuItem>
              {kind === "post" && (
                <>
                  <DropdownMenuItem onSelect={actions?.onPin}>
                    <Pin /> {actions?.pinned ? "Unpin post" : "Pin to community"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={actions?.onLock}>
                    <Lock /> {actions?.locked ? "Unlock comments" : "Lock comments"}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Tag /> Change flair
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {["Looking", "Offering", "Question", "Guide", "Resolved"].map((f) => (
                        <DropdownMenuItem key={f} onSelect={() => toast(`Flair set to “${f}”`)}>
                          {f}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
              )}
              <DropdownMenuItem variant="destructive" onSelect={actions?.onRemove}>
                <ShieldX /> Remove {kind}
              </DropdownMenuItem>
              {!isOwn && (
                <DropdownMenuItem variant="destructive" onSelect={() => setConfirmBan(true)}>
                  <Ban /> Ban {author ?? "member"}
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDialog open={report} onOpenChange={setReport} kind={kind} />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {kind}?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone. Replies will stay, but your {kind} will show as deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={actions?.onDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmBan} onOpenChange={setConfirmBan}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban {author}?</AlertDialogTitle>
            <AlertDialogDescription>They won&apos;t be able to post or comment in this community. You can unban them anytime from mod tools.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => toast(`${author} banned from this space`)}>
              Ban user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
