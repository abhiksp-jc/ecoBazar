const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  accept
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={type === "file" ? undefined : value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        accept={accept}
        className="
          w-full
          border
          border-gray-300
          rounded-md
          px-4
          py-3
          outline-none
          focus:ring-2
          focus:ring-green-500
        "
      />
    </div>
  );
};

export default Input;