// the modal component
function Modal({ show, onClose, children }) {
    if (!show) return null; // Hide modal when show is false

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center drop-shadow-2xl">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative flex flex-col">
                {/* Close Button */}
                <button 
                    className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" 
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;