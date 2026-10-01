import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
  loading = false
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">

      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6">

        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </Button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmDialog;
