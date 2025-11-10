const Divider = ({ orientation, color, thickness, dashed }) => {
  const lineColor = color || '#00000052';
  const lineThickness = thickness || '1px';
  const borderStyle = dashed ? 'dashed' : 'solid';

  if (orientation === 'horizontal') {
    return <div style={{ width: '100%', borderTop: `${lineThickness} ${borderStyle} ${lineColor}` }} />;
  }

  return <div style={{ height: '100%', borderLeft: `${lineThickness} ${borderStyle} ${lineColor}` }} />;
};

export default Divider;