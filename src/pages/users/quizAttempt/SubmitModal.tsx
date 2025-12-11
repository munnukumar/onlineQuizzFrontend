import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function SubmitModal({
  isOpen,
  onClose,
  answeredCount,
  remainingCount,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  answeredCount: number;
  remainingCount: number;
  onConfirm: () => void;
})  {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
            <Dialog.Title className="text-lg font-bold">
              Confirm Submission
            </Dialog.Title>

            <div className="mt-4">
              <p>Total attempted questions: {answeredCount}</p>
              <p>Remaining questions: {remainingCount}</p>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
                Re-attempt
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={onConfirm}
              >
                Confirm Submit
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
