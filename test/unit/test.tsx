import { render, screen } from '@testing-library/react';
import React from 'react';
import {Test} from '../../src/index';

describe('App tests', () => {
  it('should contains the heading 1', () => {
    render(<Test abc={123} />);
    const heading = screen.getByText(/123/i);
    expect(heading).toBeInTheDocument()
  });
});
