import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames";
import { XIcon } from "../icons";

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  isDanger?: boolean;
  trigger: React.ReactNode;
}

export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  onConfirm,
  isDanger = false,
  trigger,
}: ActionDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xs z-20" />
        <Dialog.Content
          className={classNames(
            "z-30 fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-96",
            "-translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-stone-200 dark:border-neutral-800"
          )}
        >
          <Dialog.Title className="m-0 text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-4 leading-relaxed">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-4">
            <Dialog.Close asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer leading-none text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100  focus:outline-none py-2 px-4 rounded-full hover:bg-stone-200 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
                onOpenChange(false);
              }}
              className={classNames(
                "cursor-pointer leading-none py-2 px-4 rounded-full transition-colors focus:shadow-[0_0_0_2px] focus:outline-none focus:ring-2",
                isDanger
                  ? "bg-red-600 text-white hover:bg-red-700 focus:shadow-red-200 dark:focus:shadow-red-900"
                  : "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:shadow-stone-200 dark:focus:shadow-neutral-700"
              )}
            >
              {confirmText}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute right-2 top-2 inline-flex size-8 p-2 appearance-none items-center justify-center rounded-full focus:outline-none hover:bg-stone-200 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
