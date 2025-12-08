import { ComponentProps } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  h1: ({ ...props }: ComponentProps<"h1">) => {
    return <h1 {...props} className="text-2xl font-bold my-2" />;
  },
  h2: ({ ...props }: ComponentProps<"h2">) => {
    return <h2 {...props} className="text-xl font-bold my-2" />;
  },
  h3: ({ ...props }: ComponentProps<"h3">) => {
    return <h3 {...props} className="text-lg font-bold my-2" />;
  },
  h4: ({ ...props }: ComponentProps<"h4">) => {
    return <h4 {...props} className="text-base font-bold my-2" />;
  },
  h5: ({ ...props }: ComponentProps<"h5">) => {
    return <h5 {...props} className="text-sm font-bold my-2" />;
  },
  h6: ({ ...props }: ComponentProps<"h6">) => {
    return <h6 {...props} className="text-xs font-bold my-2" />;
  },
  p: ({ ...props }: ComponentProps<"p">) => {
    return <p {...props} className="text-sm leading-relaxed my-4" />;
  },
  ul: ({ ...props }: ComponentProps<"ul">) => {
    return <ul {...props} className="list-disc ml-4 my-4" />;
  },
  ol: ({ ...props }: ComponentProps<"ol">) => {
    return <ol {...props} className="list-decimal ml-4 my-4" />;
  },
  li: ({ ...props }: ComponentProps<"li">) => {
    return <li {...props} className="text-sm leading-relaxed my-2" />;
  },
  hr: ({ ...props }: ComponentProps<"hr">) => {
    return <hr {...props} className="my-4" />;
  },
};

export default function MessageMarkdown({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
