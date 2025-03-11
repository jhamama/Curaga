import { useRef, useState } from "react";

export const useModal = () => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    setShowModal(true);
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    setShowModal(false);
    modalRef.current?.close();
  };

  const mountModal = (children: React.ReactNode) => {
    return (
      <dialog className="modal" ref={modalRef}>
        {showModal && children}
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    );
  };

  return { openModal, closeModal, mountModal };
};
