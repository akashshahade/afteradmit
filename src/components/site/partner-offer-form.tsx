"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PartnerOfferForm({ partner, color }: { partner: string; color: string }) {
  const [done, setDone] = React.useState(false);

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-white p-8 text-center">
        <span className="flex size-11 items-center justify-center rounded-full text-white" style={{ background: color }}>
          <Check className="size-5" strokeWidth={3} />
        </span>
        <div className="mt-4 text-[17px] font-semibold">You&apos;re all set</div>
        <p className="mt-1 max-w-[300px] text-[13.5px] text-muted-foreground">{partner} will email you within one business day with next steps and your student perk.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl border bg-white p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
        toast.success(`Request sent to ${partner}`);
      }}
    >
      <div className="text-[15px] font-semibold">Get started</div>
      <div className="space-y-1.5">
        <Label htmlFor="po-name">Full name</Label>
        <Input id="po-name" required autoComplete="name" className="h-10 text-[16px] sm:text-[14px]" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="po-email">Email</Label>
        <Input id="po-email" type="email" required autoComplete="email" className="h-10 text-[16px] sm:text-[14px]" />
      </div>
      <Button type="submit" size="lg" className="w-full text-white hover:opacity-90" style={{ background: color }}>
        Continue
      </Button>
      <p className="text-[11.5px] leading-relaxed text-muted-foreground">You choose what to share with {partner}. AfterAdmit never passes on your contact details.</p>
    </form>
  );
}
