// DropDownInput.tsx
import "./dropDown.css";

interface DropDownInputProps {
  index: number;
  onSelect?: (value: number) => void;
  options: string[];
}

export const DropDownInput: React.FC<DropDownInputProps> = ({
  index,
  options,
  onSelect,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectIndex = event.target.selectedIndex;
    onSelect?.(selectIndex);
  };

  return (
    <div className="drop-down">
      <select value={options[index]} onChange={handleChange}>
        {options.map((option, idx) => (
          <option
            key={idx}
            value={option}
            className={idx <= index ? "read" : "unread"} // Style read and unread chapters
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
