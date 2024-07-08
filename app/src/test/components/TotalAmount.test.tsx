import { render, screen, fireEvent } from '@testing-library/react';
import TotalAmount from '../../components/TotalAmount';
import { incrementStep } from 'src/store/reducers/stepper.reducers';
import { renderWithProviders } from 'src/store/test_utils';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

describe('TotalAmount component', () => {
  const totalAmount = 123.45;
  const disable = false;
  const text = 'Total amount';
  const hide = false;

  it('should render the text and total amount', () => {
    renderWithProviders(
      <TotalAmount
        totalAmount={totalAmount}
        disable={disable}
        text={text}
        hide={hide}
      />
    );
    const textElement = screen.getByText(`${text}:`);
    const totalAmountElement = screen.getByText(
      `${totalAmount.toFixed(2)} EUR/Monat`
    );
    expect(textElement).toBeInTheDocument();
    expect(totalAmountElement).toBeInTheDocument();
  });
  it('should render the button', () => {
    renderWithProviders(
      <TotalAmount
        totalAmount={totalAmount}
        disable={disable}
        text={text}
        hide={hide}
      />
    );
    const buttonElement = screen.getByRole('button', {
      name: 'Jetzt abschließen',
    });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();
  });
  it('should call incrementStep() when the button is clicked', () => {
    renderWithProviders(
      <TotalAmount
        totalAmount={totalAmount}
        disable={disable}
        text={text}
        hide={hide}
      />
    );
    const buttonElement = screen.getByRole('button', {
      name: 'Jetzt abschließen',
    });
    fireEvent.click(buttonElement);
  });
});
