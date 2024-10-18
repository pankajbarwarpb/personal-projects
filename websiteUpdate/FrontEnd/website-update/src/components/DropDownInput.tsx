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
    onSelect?.(selectIndex); // Call the provided onSelect function with the selected index
  };

  console.log({ options, index });

  return (
    <div className="drop-down">
      <span>{options[index]}</span>
      <select value={options[index]} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
