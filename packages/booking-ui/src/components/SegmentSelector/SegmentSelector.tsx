import { type CSSProperties, type KeyboardEvent, type ReactNode, useMemo, useRef } from "react";

export interface SegmentSelectorSegment {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface SegmentSelectorProps {
  segments: SegmentSelectorSegment[];
  value: string | null;
  onChange: (id: string) => void;
  columns?: number;
  ariaLabel?: string;
}

export function SegmentSelector({ segments, value, onChange, columns = 2, ariaLabel = "Segment wählen" }: SegmentSelectorProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = useMemo(() => segments.findIndex((segment) => segment.id === value), [segments, value]);
  const style = { "--bk-segment-columns": columns } as CSSProperties;

  function moveSelection(currentIndex: number, direction: 1 | -1) {
    if (!segments.length) return;
    const nextIndex = (currentIndex + direction + segments.length) % segments.length;
    onChange(segments[nextIndex].id);
    window.setTimeout(() => buttonRefs.current[nextIndex]?.focus(), 0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(index, 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(index, -1);
    }
  }

  return (
    <div className="segment-grid" role="radiogroup" aria-label={ariaLabel} style={style}>
      {segments.map((segment, index) => {
        const active = segment.id === value;

        return (
          <button
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            className={active ? "segment-card active" : "segment-card"}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active || (selectedIndex === -1 && index === 0) ? 0 : -1}
            key={segment.id}
            onClick={() => onChange(segment.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {segment.icon && <span className="segment-card-icon">{segment.icon}</span>}
            <span>
              <strong>{segment.title}</strong>
              <small>{segment.description}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
