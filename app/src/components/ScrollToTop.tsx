import { useScrollTrigger, Zoom } from '@mui/material';

interface ScrollTopProps {
  children: React.ReactNode;
}

const ScrollTop: React.FC<ScrollTopProps> = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent) => {
    const anchor = (
      (event.target as HTMLElement)?.ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        style={{ position: 'fixed', bottom: '3rem', right: '2rem' }}
      >
        {children}
      </div>
    </Zoom>
  );
};

export default ScrollTop;
