import React from 'react';
import { render } from '@testing-library/react';
import { mocdata } from './mocdata';
import { renderWithProviders } from './store/test_utils';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
  });
});
