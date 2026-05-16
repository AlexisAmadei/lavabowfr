interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: string;
  dashed?: boolean;
  dashArray?: string;
  rounded?: boolean;
}

const Divider: React.FC<DividerProps> = ({ orientation, color, thickness, dashed, dashArray, rounded }) => {
  const lineColor = color || '#00000052';
  const lineThickness = thickness || '1px';
  const dashPattern = dashArray || '8 6'; // Default: 8px dash, 6px gap
  const lineCap = rounded ? 'round' : 'butt'; // Round or square line caps

  // Use SVG pattern for more spaced dashes
  if (dashed) {

    if (orientation === 'horizontal') {
      return (
        <svg width="100%" height={lineThickness} style={{ display: 'block' }}>
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={lineColor}
            strokeWidth={lineThickness}
            strokeDasharray={dashPattern}
            strokeLinecap={lineCap}
          />
        </svg>
      );
    }

    return (
      <svg height="100%" width={lineThickness} style={{ display: 'block' }}>
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke={lineColor}
          strokeWidth={lineThickness}
          strokeDasharray={dashPattern}
          strokeLinecap={lineCap}
        />
      </svg>
    );
  }

  const borderStyle = 'solid';

  if (orientation === 'horizontal') {
    return <div style={{ width: '100%', borderTop: `${lineThickness} ${borderStyle} ${lineColor}` }} />;
  }

  return <div style={{ height: '100%', borderLeft: `${lineThickness} ${borderStyle} ${lineColor}` }} />;
};

export default Divider;
