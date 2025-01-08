import * as Fa from 'react-icons/fa6';

import './Modal.css';

const Modal = ({ content, display, onClose, ref, title = "" }) => {
    return (
        <div className='modal' ref={ref} style={{display: !display ? "none" : ""}}>
            <header>
                <p>{title}</p>
                <div className='modal-header-buttons'>
                    <button onClick={onClose}><Fa.FaXmark /></button>
                </div>
            </header>
            {content}
        </div>
    );
};

export default Modal;