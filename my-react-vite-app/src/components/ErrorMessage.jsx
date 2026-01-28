const ErrorMessage = ({ message, onClose }) => (
  <div className="error-message">
    <span>{message}</span>
    {onClose && (
      <button 
        onClick={onClose}
        aria-label="Close error message"
      >
        ×
      </button>
    )}
  </div>
);

export default ErrorMessage;
