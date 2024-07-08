import { fireEvent, render, screen } from '@testing-library/react';
import TooltipReusable from '../../components/TooltipReusable';

describe('TooltipReusable component', () => {
  const title = ['Title 1', 'Title 2'];

  it('should render the tooltip with multiple titles on hover', async () => {
    render(<TooltipReusable title={title} />);
    const infoIcon = screen.getByTestId('InfoIcon');
    const tooltip = screen.queryByRole('tooltip');

    expect(tooltip).not.toBeInTheDocument();

    fireEvent.mouseEnter(infoIcon);

    const tooltipContent = await screen.findByRole('tooltip');
    expect(tooltipContent).toHaveTextContent(title[0]);
    expect(tooltipContent).toHaveTextContent(title[1]);

    fireEvent.mouseLeave(infoIcon);
  });

  it('should render the tooltip with a single title on hover', async () => {
    const singleTitle = ['Title'];
    render(<TooltipReusable title={singleTitle} />);
    const infoIcon = screen.getByTestId('InfoIcon');

    const tooltip = screen.queryByRole('tooltip');

    expect(tooltip).not.toBeInTheDocument();

    fireEvent.mouseEnter(infoIcon);

    const tooltipContent = await screen.findByRole('tooltip');
    expect(tooltipContent).toHaveTextContent(singleTitle[0]);

    fireEvent.mouseLeave(infoIcon);
  });
});
