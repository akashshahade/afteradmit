"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "url" | "textarea" | "select" | "switch";
  defaultValue?: string | number | boolean;
  placeholder?: string;
  options?: string[];
  hint?: string;
  required?: boolean;
};

export type FormSheetConfig = {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  success: string;
  successDescription?: string;
  onSubmit?: (values: Record<string, string>) => void;
};

export function FormSheet({ config, onClose }: { config: FormSheetConfig | null; onClose: () => void }) {
  return (
    <Sheet open={!!config} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="sm:max-w-[480px]">
        {config && (
          <form
            className="flex h-full min-h-0 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const values = Object.fromEntries(Array.from(data.entries()).map(([k, v]) => [k, String(v)]));
              config.onSubmit?.(values);
              toast.success(config.success, config.successDescription ? { description: config.successDescription } : undefined);
              onClose();
            }}
          >
            <SheetHeader>
              <SheetTitle>{config.title}</SheetTitle>
              {config.description && <SheetDescription>{config.description}</SheetDescription>}
            </SheetHeader>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {config.fields.map((f) => (
                <div key={f.name} className={f.type === "switch" ? "flex items-center justify-between gap-6 rounded-xl border px-4 py-3" : "space-y-1.5"}>
                  {f.type === "switch" ? (
                    <>
                      <div>
                        <Label htmlFor={f.name}>{f.label}</Label>
                        {f.hint && <p className="mt-0.5 text-[12px] text-muted-foreground">{f.hint}</p>}
                      </div>
                      <Switch id={f.name} name={f.name} defaultChecked={Boolean(f.defaultValue)} />
                    </>
                  ) : (
                    <>
                      <Label htmlFor={f.name}>{f.label}</Label>
                      {f.type === "textarea" ? (
                        <Textarea id={f.name} name={f.name} required={f.required} defaultValue={f.defaultValue as string} placeholder={f.placeholder} className="text-[16px] sm:text-[13.5px]" />
                      ) : f.type === "select" ? (
                        <Select name={f.name} defaultValue={(f.defaultValue as string) ?? f.options?.[0]}>
                          <SelectTrigger id={f.name} className="h-10 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {f.options?.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={f.name}
                          name={f.name}
                          type={f.type ?? "text"}
                          required={f.required}
                          defaultValue={f.defaultValue as string | number | undefined}
                          placeholder={f.placeholder}
                          className="h-10 text-[16px] sm:text-[13.5px]"
                        />
                      )}
                      {f.hint && <p className="text-[12px] text-muted-foreground">{f.hint}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="ink">
                {config.submitLabel ?? "Save changes"}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
