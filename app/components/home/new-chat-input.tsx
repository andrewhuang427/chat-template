"use client";

import { CornerDownLeftIcon, Loader2Icon } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { trpc } from "../trpc-provider";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function NewChatInput() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: newChat } = trpc.stream.useMutation();

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

  async function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await newChat({ message });
      for await (const chunk of response) {
        console.log(chunk);
      }
      setMessage("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4 max-w-2xl w-full p-4 bg-card rounded-lg border"
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={textareaRef}
        placeholder="Ask me anything..."
        className="border-none !bg-card focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-0 min-h-10"
        value={message}
        onChange={handleTextareaChange}
        onKeyDown={handleTextareaKeyDown}
      />
      <div className="flex items-center justify-end gap-4">
        <HelperText />
        <Button type="submit" disabled={isSubmitting}>
          Enter
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
    <p className="text-sm text-muted-foreground text-xs">
      Press <span className="font-medium text-primary">Shift</span> +{" "}
      <span className="font-medium text-primary">Enter</span> to add a new line
    </p>
  );
}
