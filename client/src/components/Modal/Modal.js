import React from "react";
import "./Modal.css";

const Modal = ({
    children,
    title,
    canConfirm,
    canCancel,
    onCancel,
    onConfirm,
    confirmText
}) => {
    return (
        <div className="modal">
            <header className="modal__header">
                <h1>{title}</h1>
            </header>
            <section className="modal__content">{children}</section>
            <section className="modal__actions">
                {canConfirm && (
                    <button
                        className="btn"
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                    >
                        {confirmText}
                    </button>
                )}
                {canCancel && (
                    <button className="btn" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </section>
        </div>
    );
};

export default Modal;
