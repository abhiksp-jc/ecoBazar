const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
  className = ""
}) => {
  const styles = {
    primary:
      "bg-green-600 text-white hover:bg-green-700",

    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",

    danger:
      "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md font-medium
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;