import * as Fa from 'react-icons/fa6';

import './Modal.css';

const Modal = ({ content, display, goBack, ref, title = "", theme = "light", onClose, onGoBack }) => {
    return (
        <div className={`modal-container ${theme}`} style={{ display: !display ? "none" : "" }}>
            <div className='modal-box' ref={ref}>
                <header>
                    <div className='modal-header-buttons' style={{ display: !goBack ? "none" : "" }}>
                        <button onClick={onGoBack} title='Retourner en arrière'><Fa.FaChevronLeft /></button>
                    </div>
                    <p>{title}</p>
                    <div className='modal-header-buttons'>
                        <button onClick={onClose} title='Fermer'><Fa.FaXmark /></button>
                    </div>
                </header>
                {content} 
            </div>
        </div>
    );
};

export default Modal;