import './Popup.css';

const Popup = ({ content, display, ref, theme = "light", top, bottom, left, right }) => {
    return (
        <div className={`popup ${theme}`} ref={ref} style={{ display: !display ? "none" : "", top: top, bottom: bottom, left: left, right: right }}>
            {content}
        </div>
    );
};

export default Popup;