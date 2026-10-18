export default function StatusMessage({
  title,
  message,
  tone = "info",
  actionLabel,
  onAction,
}) {
  return (
    <div className={`status-message status-message--${tone}`}>
      <h2 className="status-message__title">{title}</h2>
      <p className="status-message__text">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="status-message__button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
