const Modal = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;