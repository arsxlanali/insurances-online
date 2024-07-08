import { screen } from '@testing-library/react';
import InsuranceCharges from '../../pages/contribution/InsuranceCharges';
import { renderWithProviders } from 'src/store/test_utils';

describe('InsuranceCharges component', () => {
  const mockData = [
    {
      title: 'Option 1',
      total: 10,
      options: [
        {
          id: '1',
          displayString: 'Option 1 - A',
          fee: 5,
          insuranceName: 'Abc',
          descriptions: {},
          selected: true,
        },
        {
          id: '2',
          displayString: 'Option 1 - B',
          fee: 5,
          insuranceName: 'Abc',
          descriptions: {},
          selected: false,
        },
      ],
    } as ContributionCategory,
  ];

  test('renders InsuranceInfo component for each item in data prop', () => {
    renderWithProviders(
      <InsuranceCharges
        data={mockData}
        index={0}
        personIdx={1}
        personTotal={10}
      />
    );

    const insuranceInfos = screen.getAllByRole('button');
    expect(insuranceInfos).toHaveLength(mockData.length + 1);
  });
});
