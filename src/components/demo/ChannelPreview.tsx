"use client";

import { MessageCircle, MessageSquareText, PhoneCall } from "lucide-react";
import { Tabs } from "radix-ui";
import { clinic, type CallLanguage } from "@/content/demo-call";
import { cn } from "@/lib/utils";
import { CallPanel } from "./CallPanel";
import { DemoTimeline } from "./DemoTimeline";

const message = `Hello Rafiq, this is ${clinic.name} on behalf of ${clinic.doctorShort}. Your recent test results are ready and the doctor would like to see you. Reply 1 for Thu 10:30, 2 for Sat 11:00, or 3 for a call back.`;

/** Step 4: the same follow-up, by WhatsApp, SMS or AI voice call. */
export function ChannelPreview({
  lang = "bn",
  className,
}: {
  lang?: CallLanguage;
  className?: string;
}) {
  return (
    <Tabs.Root defaultValue="call" className={cn("w-full max-w-md", className)}>
      <Tabs.List aria-label="Channel" className="mb-4 flex rounded-full glass-1 p-1 text-xs">
        {[
          { v: "whatsapp", label: "WhatsApp", icon: MessageCircle },
          { v: "sms", label: "SMS", icon: MessageSquareText },
          { v: "call", label: "AI call", icon: PhoneCall },
        ].map(({ v, label, icon: Icon }) => (
          <Tabs.Trigger
            key={v}
            value={v}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 font-medium text-ink-muted transition-colors data-[state=active]:bg-ink data-[state=active]:text-white"
          >
            <Icon className="size-3.5" /> {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="whatsapp" className="space-y-2">
        <Bubble from={clinic.name}>{message}</Bubble>
        <Bubble self>1</Bubble>
        <Bubble from={clinic.name}>
          Booked: Thu 8 Oct, 10:30 with {clinic.doctorShort}. Reply C to change.
        </Bubble>
        <PilotNote>WhatsApp and SMS are the first pilot product.</PilotNote>
      </Tabs.Content>

      <Tabs.Content value="sms" className="space-y-2">
        <Bubble from="GreenRoad">{message}</Bubble>
        <Bubble self>1</Bubble>
        <PilotNote>WhatsApp and SMS are the first pilot product.</PilotNote>
      </Tabs.Content>

      <Tabs.Content value="call">
        <DemoTimeline lang={lang} autoplay loop initialT={7200} speed={1.4}>
          <CallPanel window={2} transcriptClassName="h-[10.5rem]" />
        </DemoTimeline>
        <PilotNote>AI voice follow-up: rolling out 2027. Product demo.</PilotNote>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function Bubble({
  children,
  from,
  self,
}: {
  children: React.ReactNode;
  from?: string;
  self?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.82rem] leading-snug shadow-sm",
        self ? "ms-auto rounded-se-md bg-[#DCF8E6] text-ink" : "rounded-ss-md bg-white text-ink",
      )}
    >
      {from && <div className="mb-0.5 text-[10px] font-semibold text-success-ink">{from}</div>}
      {children}
    </div>
  );
}

function PilotNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-center font-mono text-[10px] tracking-wide text-ink-muted uppercase">
      {children}
    </p>
  );
}
