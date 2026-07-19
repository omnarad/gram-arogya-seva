import React from 'react';

export default function StarRating({ value = 0, onChange, size = 18, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(s)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          aria-label={`${s} star`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={s <= value ? '#D98E04' : 'none'}
            stroke="#D98E04"
            strokeWidth="1.5"
          >
            <path d="M12 2.5l2.9 6.02 6.6.72-4.9 4.6 1.28 6.56L12 16.9l-5.88 3.5 1.28-6.56-4.9-4.6 6.6-.72L12 2.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
