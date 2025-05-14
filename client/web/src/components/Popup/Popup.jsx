import './Popup.css';

const Popup = ({ content, display, ref, theme = "light" }) => {
    return (
        <div className={`popup ${theme}`} ref={ref} style={{ display: display ? '' : 'none' }}>
            {content}
        </div>
    );
};

export default Popup;
