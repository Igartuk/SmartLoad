interface FormFieldProps<T> {
  label: keyof T & string;
  obj: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isReadOnly?: boolean;
  type?: "number" | "text";
  className: string;
}

export function FormField<T>({
  label,
  obj,
  onChange,
  isReadOnly,
  type = "number",
  className,
}: FormFieldProps<T>) {
  const formattedLabel = label
    .replace(/([A-Z])/g, " $1")
    .replace(/^max/i, "Max ")
    .trim();

  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
        {formattedLabel}
      </label>
      <input
        type={type}
        name={label}
        value={String(obj[label] ?? "")}
        onChange={onChange}
        readOnly={isReadOnly}
        className={className}
      />
    </div>
  );
}
