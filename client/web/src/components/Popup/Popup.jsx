import './Popup.css';

const Popup = ({ content, display, ref, theme = "light", top, left, bottom, right }) => {
  const positionStyle = {
    position: 'absolute',
    zIndex: 10,
    top,
    left,
    bottom,
    right,
  };

  return (
    <div
      className={`popup ${theme}`}
      ref={ref}
      style={{
        display: display ? '' : 'none',
        ...positionStyle,
      }}
    >
      {content}
    </div>
  );
};

export default Popup;
