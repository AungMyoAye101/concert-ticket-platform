"use client";
import { createPortal } from "react-dom";

type ModalPropsType = {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onComfrim: () => void;
};

const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  onComfrim,
}: ModalPropsType) => {
  if (!isOpen) return;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 text-violet-200">
      <div className="w-full max-w-sm rounded-xl border border-white/60 bg-slate-950 p-6">
        <div className="mb-4 space-y-2">
          <h1 className="text-4xl font-medium">{title}</h1>
          <p>{description}</p>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <button
            className="px-4 py-2 font-medium rounded-xl border border-cyan-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 font-medium rounded-xl text-black bg-cyan-400"
            onClick={onComfrim}
          >
            Comfrim
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal") as HTMLDivElement,
  );
};

export default Modal;
