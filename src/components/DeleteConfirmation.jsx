import './DeleteConfirmation.css';

const DeleteConfirmation = ({ registration, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                <div className="delete-icon">⚠️</div>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this registration?</p>
                <div className="delete-details">
                    <p><strong>Name:</strong> {registration.name}</p>
                    <p><strong>Email:</strong> {registration.email}</p>
                </div>
                <div className="delete-actions">
                    <button onClick={onCancel} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn-confirm-delete">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;