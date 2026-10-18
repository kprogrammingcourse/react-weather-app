const UNIT_OPTIONS = [
  { value: "celsius", label: "°C" },
  { value: "fahrenheit", label: "°F" },
];

export default function UnitToggle({ unit, onUnitChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      {UNIT_OPTIONS.map((option) => {
        const isActive = option.value === unit;

        return (
          <button
            key={option.value}
            type="button"
            className={
              isActive
                ? "unit-toggle__button unit-toggle__button--active"
                : "unit-toggle__button"
            }
            aria-pressed={isActive}
            onClick={() => onUnitChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
