"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { PASSWORD_RULES, passwordChecks, passwordScore } from "@/lib/password";
import { cn } from "@/lib/utils";

export function PasswordChecklist({ password }: { password: string }) {
  if (!password) return null;
  const checks = passwordChecks(password);
  const score = passwordScore(password);

  return (
    <div className="space-y-2 pt-1">
      <div className="grid grid-cols-5 gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full transition-colors",
              score >= i
                ? score >= 5
                  ? "bg-success"
                  : score >= 3
                    ? "bg-amber-500"
                    : "bg-primary"
                : "bg-border",
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = checks[rule.key];
          return (
            <div
              key={rule.key}
              className={cn(
                "flex items-center gap-1.5 text-[11.5px]",
                ok ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Check className={cn("size-3 shrink-0", ok ? "text-success" : "text-border")} />
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
