import MessageMarkdown from "../message-markdown";

type Props = {
  content: string;
};

export default function AssistantMessage({ content }: Props) {
  return (
    <div className="flex w-full">
      <MessageMarkdown content={content} />
    </div>
  );
}
