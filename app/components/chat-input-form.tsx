"use client";

import { CornerDownLeftIcon, Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type Props = {
  className?: string;
  placeholder: string;
  isSubmitting: boolean;
  onSubmit: (message: string) => Promise<void>;
};

export default function ChatInputForm({
  className,
  placeholder,
  isSubmitting,
  onSubmit,
}: Props) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const isEnterWithoutShift = e.key === "Enter" && !e.shiftKey;
    if (isEnterWithoutShift) {
      e.preventDefault();
      handleSubmit();
    }
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    try {
      setMessage("");
      await onSubmit(message);
    } catch {
      toast.error("Failed to send message");
    }
  }

  return (
    <form
      className={cn(
        "flex flex-col gap-4 max-w-2xl w-full p-4 bg-card rounded-lg border",
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        className="border-none bg-card! focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-0 min-h-10"
        value={message}
        onChange={handleTextareaChange}
        onKeyDown={handleTextareaKeyDown}
      />
      <div className="flex items-center justify-end gap-4">
        <HelperText />
        <Button type="submit" disabled={isSubmitting}>
          Send
          {isSubmitting ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <CornerDownLeftIcon />
          )}
        </Button>
      </div>
    </form>
  );
}

function HelperText() {
  return (
    <p className="text-muted-foreground text-sm">
      Press <span className="font-medium text-primary">Shift</span> +{" "}
      <span className="font-medium text-primary">Enter</span> to add a new line.
    </p>
  );
}
