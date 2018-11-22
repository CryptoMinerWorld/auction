import React from 'react';
import { fireEvent } from 'react-testing-library';
import AvatarDropdown from '../components/AvatarDropdown';
import { renderWithRouter } from '../../../app/testSetup';
import 'jest-dom/extend-expect';

jest.mock('react-ga');

const props = {
  to: 'string',
  userImage: 'string',
  userName: 'string',
};

test('AvatarDropdown renders correctly', () => {
  const { container } = renderWithRouter(<AvatarDropdown {...props} />, {
    route: '/',
  });
  expect(container).toMatchSnapshot();
});

test('AvatarDropdown open drop down menu on hover', () => {
  const { getByTestId, queryByTestId } = renderWithRouter(<AvatarDropdown {...props} />, {
    route: '/',
  });
  expect(queryByTestId('menu')).not.toBeInTheDocument();
  fireEvent.mouseEnter(getByTestId('avatar'));
  expect(getByTestId('menu')).toBeInTheDocument();
});

test.skip('AvatarDropdown closes dropdown when you mouseLeave', () => {});
test.skip('AvatarDropdown closes dropdown when you click', () => {});
test.skip('AvatarDropdown checks for pending tx on mount', () => {});
test.skip('AvatarDropdown unsubscribes on unmount', () => {});
test.skip('AvatarDropdown unsubscribes is axe complinat', () => {});
test.skip('AvatarDropdown unsubscribes handles errors component gracefully', () => {});
