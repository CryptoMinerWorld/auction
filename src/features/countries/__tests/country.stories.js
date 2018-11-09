import { storiesOf } from '@storybook/react';
import backgrounds from '@storybook/addon-backgrounds';
import React from 'react';
import centered from '@storybook/addon-centered';
import indianFlag from '../../../app/images/flags/in.png';
// import { text, boolean } from '@storybook/addon-knobs/react';
import CountryDetails from '../components/Dashboard/CountryDetails';
import Dashboard from '../components/Dashboard/index';
import { testCountries } from './testData';
// import CountryBar from '../components/Dashboard/CountryBar';
import { CountryCard } from '../components/Dashboard/CountryBar';

storiesOf('Dashboard Components', module)
  .addDecorator(backgrounds([{ name: 'light', value: '#FFF', default: true }]))
  .addDecorator(centered)
  .addWithJSX('CountryCard', () => (
    <CountryCard
      name="India"
      image="http://bestabstractwallpapers.com/wp-content/uploads/2017/12/Blank-India-map-images-with-transparent-background.png"
      flags={indianFlag}
    />
  ))
  .addWithJSX('CountryDetails', () => (
    <CountryDetails

      name="India"
      durationOwned="8 months 3 days"
      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      totalPlots={54}
      plotsBought={0}
      plotsMined={0}
      plotsForAuction={54}
      image="http://bestabstractwallpapers.com/wp-content/uploads/2017/12/Blank-India-map-images-with-transparent-background.png"
      lastPrice={4.3}
      roi={17}
    />
  ));

storiesOf('Dashboard Page', module)
  .addDecorator(backgrounds([{ name: 'light', value: '#FFF', default: true }]))
  .addDecorator(centered)
  .addWithJSX('Empty', () => <Dashboard countries={[]} />)
  .addWithJSX('With Countries', () => <Dashboard countries={testCountries} />);
