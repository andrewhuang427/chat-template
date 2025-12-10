type Props = {
  content: string;
};

export default function UserMessage({ content }: Props) {
  return (
    <div className="flex w-full justify-end">
      <div className="rounded-md text-sm bg-secondary text-secondary-foreground p-2.5">
        {content}
      </div>
    </div>
  );
}
