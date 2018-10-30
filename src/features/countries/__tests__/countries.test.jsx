import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { MockedProvider } from 'react-apollo/test-utils';
import gql from 'graphql-tag';
import { debug } from 'util';
import Map from '../index.jsx';

afterEach(cleanup);

const mocks = [{
  request: {
    query: gql`
  {
    user(id: "0xd9b74f73d933fde459766f74400971b29b90c9d2") {
      name
    }
  }
`,
    variables: { id: '123' },
  },
  result: {
    data: {
      item: 'Josh',
    },
  },
}];

describe('Country Map', () => {
  test('map page renders', async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider>
        <Map />
      </MockedProvider>,
    );
    expect(getByTestId('mapPage')).toBeInTheDocument();
    expect(getByTestId('mapComponent')).toBeInTheDocument();
    expect(getByTestId('cartComponent')).toBeInTheDocument();
    expect(getByText('John Brown')).toBeInTheDocument();
  });

  test.skip('when I click on a countrty its details appear in the detail bar', async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider>
        <Map />
      </MockedProvider>,
    );


    expect(true).toBeFalsy();
  });
});
