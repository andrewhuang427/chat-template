import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents = {
  h1: ({ node, ...props }: any) => {
    return <h1 {...props} className="text-2xl font-bold my-2" />;
  },
  h2: ({ node, ...props }: any) => {
    return <h2 {...props} className="text-xl font-bold my-2" />;
  },
  h3: ({ node, ...props }: any) => {
    return <h3 {...props} className="text-lg font-bold my-2" />;
  },
  h4: ({ node, ...props }: any) => {
    return <h4 {...props} className="text-base font-bold my-2" />;
  },
  h5: ({ node, ...props }: any) => {
    return <h5 {...props} className="text-sm font-bold my-2" />;
  },
  h6: ({ node, ...props }: any) => {
    return <h6 {...props} className="text-xs font-bold my-2" />;
  },
  p: ({ node, ...props }: any) => {
    return <p {...props} className="text-sm my-4" />;
  },
  ul: ({ node, ...props }: any) => {
    return <ul {...props} className="list-disc ml-4 my-4" />;
  },
  ol: ({ node, ...props }: any) => {
    return <ol {...props} className="list-decimal ml-4 my-4" />;
  },
  li: ({ node, ...props }: any) => {
    return <li {...props} className="text-sm my-2" />;
  },
  hr: ({ node, ...props }: any) => {
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
