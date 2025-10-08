const Divider = ({ orientation }) => {
  if (orientation === 'horizontal')
    return <div style={{ height: '1px', backgroundColor: '#00000052', width: '100%' }} />;
  return <div style={{ width: '1px', backgroundColor: '#00000052', height: '100%' }} />;
};

export default Divider;