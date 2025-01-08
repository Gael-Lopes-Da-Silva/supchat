import './Popup.css';

const Popup = ({ content, display, ref, top, bottom, left, right }) => {
    return (
        <div className='popup' ref={ref} style={{display: !display ? "none" : "", top: top, bottom: bottom, left: left, right: right}}>
            {content}
        </div>
    );
};

export default Popup;