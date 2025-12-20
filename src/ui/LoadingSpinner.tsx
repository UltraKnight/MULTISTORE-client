export default function LoadingSpinner({
  noMargin = false,
  isSmall = false,
}: {
  noMargin?: boolean;
  isSmall?: boolean;
}) {
  return (
    <div className={`d-flex justify-content-center ${noMargin ? '' : 'm-5'}`}>
      <div
        className={`spinner-border text-warning ${isSmall ? 'spinner-border-sm' : 'spinner-border-lg'}`}
        style={{ width: isSmall ? '1rem' : '3rem', height: isSmall ? '1rem' : '3rem' }}
        role='status'
      >
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  );
}
