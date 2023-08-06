import { PlusSmallIcon, XMarkIcon } from "@heroicons/react/24/solid";

type ChipProps =
  | {
      item?: string;
      isDeleteable?: false;
      isAddChip?: boolean;
    }
  | {
      item: string;
      isDeleteable: true;
      onDelete: () => void;
    };

export const Chip = (props: ChipProps) => {
  const Component = props.isDeleteable || props.isAddChip ? "button" : "div";

  if (!props.isDeleteable && props.isAddChip)
    return (
      <Component className="mr-2 flex items-center justify-center rounded-full border-2 border-primary/25 px-2 py-1 text-xs font-bold">
        <PlusSmallIcon className={"h-4 w-4 text-primary"} />
      </Component>
    );

  return (
    <Component
      className="mr-2 flex items-center justify-center gap-2 rounded-full border-2 border-primary/25 px-2 py-1 text-xs font-bold"
      onClick={() => {
        if (!props.isDeleteable) return;
        props.onDelete();
      }}
    >
      <span>{props.item}</span>
      {props.isDeleteable && (
        <XMarkIcon className={"h-4 w-4 text-primary/75"} />
      )}
    </Component>
  );
};
