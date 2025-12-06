import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { CornerDownLeftIcon } from "lucide-react";

export default function NewChatInput() {
  return (
    <div className="flex flex-col gap-4 max-w-2xl w-full p-6 bg-card rounded-lg border">
      <Textarea
        placeholder="Ask me anything..."
        className="border-none !bg-card focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-0"
      />
      <div className="flex items-center justify-end">
        <Button>
          Enter
          <CornerDownLeftIcon />
        </Button>
      </div>
    </div>
  );
}
