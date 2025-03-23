import React from 'react';
import * as Fa from "react-icons/fa6";

const FooterButtons = ({ hideAllPopup, updatePopupState, setMousePosition }) => {
    return (
        <>
            <div className="dashboard-right-footer-buttons">
                <button title="Uploader un fichier">
                    <Fa.FaCirclePlus />
                </button>
            </div>
            <div className="dashboard-right-footer-buttons">
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        hideAllPopup();
                        updatePopupState("emojis", true);
                        setMousePosition({
                            x: event.clientX,
                            y: event.clientY,
                        });
                    }}
                    title="Insérer un émoji"
                >
                    <Fa.FaFaceSmile />
                </button>
            </div>
        </>
    );
};

export default FooterButtons;
