import { render, screen } from '@testing-library/react';
import InsuranceStep from '../../components/InsuranceStep';
import { renderWithProviders } from 'src/store/test_utils';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => true,
}));

describe('InsuranceStep component', () => {
  it('renders all steps in the stepper', () => {
    const { getByText } = renderWithProviders(<InsuranceStep />);
    const steps = [
      'Beitrag',
      'Versicherte Personen',
      'Ihre Daten',
      'Zahlweise',
      'Ihr Angebot',
      'Zusammenfassung',
    ];

    steps.forEach((step) => {
      expect(getByText(step)).toBeInTheDocument();
    });
  });
});
