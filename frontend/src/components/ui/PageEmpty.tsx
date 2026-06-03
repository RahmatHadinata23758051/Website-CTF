import { EmptyState } from "./EmptyState";

interface PageEmptyProps {
  title?: string;
  description?: string;
  onActionClick?: () => void;
  actionText?: string;
}

export function PageEmpty({
  title,
  description,
  onActionClick,
  actionText,
}: PageEmptyProps) {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      <EmptyState
        title={title}
        description={description}
        onActionClick={onActionClick}
        actionText={actionText}
        className="w-full max-w-lg"
      />
    </div>
  );
}
