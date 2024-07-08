import { useAppSelector } from 'src/utils/hooks';
import { Box } from '@mui/material';

interface RequireContext {
  keys(): string[];
  <T>(id: string): T;
  resolve(id: string): string;
}

const logosContext: RequireContext = (require as any).context(
  '../../public/logos/',
  false,
  /\.(png|jpe?g|svg)$/
);

const logos: Record<string, string> = logosContext
  .keys()
  .reduce((acc: Record<string, string>, logoPath: string) => {
    const filename = logoPath.replace('./', '');
    const key = filename.split('.')[0];
    acc[key] = filename;
    return acc;
  }, {});

export function HomeIcon() {
  const { mandant, logo } = useAppSelector((state) => state?.config);
  const isValidLogo = mandant && logos[mandant];

  const flexPosition: Record<string, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  return isValidLogo ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: flexPosition[logo.position],
      }}
    >
      <img
        src={`${window.location.origin}/logos/${logos[mandant]}`}
        height={`${logo.size}%`}
        width={`${logo.size}%`}
        alt="Logo"
        style={{
          margin: '20px',
        }}
      />
    </Box>
  ) : null;
}
