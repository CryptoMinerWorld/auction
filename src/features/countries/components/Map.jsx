import React from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  // Markers,
  // Marker,
} from 'react-simple-maps';
import chroma from 'chroma-js';
import PropTypes from 'prop-types';
// import { Tooltip, actions } from 'redux-tooltip';
// import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
};

const colorScale = chroma
  .scale(['#FF6E40', 'FFD740', '#00B8D4'])
  .mode('lch')
  .colors(24);

const subregions = [
  'Southern Asia',
  'Polynesia',
  'Micronesia',
  'Southern Africa',
  'Central Asia',
  'Melanesia',
  'Western Europe',
  'Central America',
  'Seven seas (open ocean)',
  'Northern Africa',
  'Caribbean',
  'South-Eastern Asia',
  'Eastern Africa',
  'Australia and New Zealand',
  'Eastern Europe',
  'Western Africa',
  'Southern Europe',
  'Eastern Asia',
  'South America',
  'Middle Africa',
  'Antarctica',
  'Northern Europe',
  'Northern America',
  'Western Asia',
];

const Map = ({
  data,
  setSelection,
  addToCart,
  // handleCityClick,
  zoom,
  handleReset,
  coordinates,
}) => (
  <div style={wrapperStyles} data-testid="mapComponent">
    {/* <button type="button" onClick={handleZoomIn()}>
        Zoom in
      </button>
      <button type="button" onClick={handleZoomOut()}>
        Zoom out
      </button> */}
    <button type="button" onClick={handleReset()}>
      Reset
    </button>
    <hr />
    <Motion
      defaultStyle={{
        zoom: 1,
        x: 0,
        y: 20,
      }}
      style={{
        zoom: spring(zoom, { stiffness: 210, damping: 20 }),
        x: spring(coordinates[0], { stiffness: 210, damping: 20 }),
        y: spring(coordinates[1], { stiffness: 210, damping: 20 }),
      }}
    >
      {/* eslint-disable-next-line */
      ({ zoom, x, y }) => (
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11, 0, 0],
          }}
          width={980}
          height={551}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <ZoomableGroup center={[x, y]} zoom={zoom}>
            <Geographies geography={data} disableOptimization>
              {(geographies, projection) => geographies.map(geography => (
                <Geography
                  key={geography.properties.name}
                  geography={geography}
                  onMouseEnter={() => setSelection({
                    name: geography.properties.name,
                    plots: geography.properties.totalPlots,
                    price: geography.properties.price,
                    roi: geography.properties.roi,
                    id: geography.properties.countryId,
                  })
                    }
                  onMouseLeave={() => setSelection({})}
                  onClick={() => addToCart({
                    id: geography.properties.countryId,
                    country: geography.properties.name,
                    price: geography.properties.price,
                    plots: geography.properties.totalPlots,
                    roi: geography.properties.roi,
                    return: 54,
                    sold: geography.properties.sold,
                    mapIndex: geography.properties.mapIndex,
                  })
                    }
                  projection={projection}
                  data-testid={geography.properties.name}
                  style={{
                    default: {
                      fill: `${
                        geography.properties.sold === true ? colorScale[1] : colorScale[13]
                      }`,
                      // fill: 'black',
                      stroke: 'white',
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                    hover: {
                      fill: chroma(
                        colorScale[subregions.indexOf(geography.properties.subregion)],
                      ).darken(0.5),
                      stroke: 'white',
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                    pressed: {
                      fill: chroma(
                        colorScale[subregions.indexOf(geography.properties.subregion)],
                      ).brighten(0.5),
                      stroke: 'white',
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                  }}
                />
              ))
              }
            </Geographies>
            {/* <Markers>
              {cities.map(city => (
                <Marker key={city.name} marker={city} onClick={handleCityClick()}>
                  <circle cx={0} cy={0} r={6} fill="#FF5722" stroke="#DF3702" />
                </Marker>
              ))}
            </Markers> */}
          </ZoomableGroup>
        </ComposableMap>
      )}
    </Motion>
  </div>
);

Map.propTypes = {
  // handleMove: PropTypes.func.isRequired,
  // handleLeave: PropTypes.func.isRequired,
  // handleSelect: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
  setSelection: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  // handleCityClick: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  handleReset: PropTypes.func.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
};
// const { show, hide } = actions;

// const action = ({
//   handleMove: (geography, evt) => {
//     const x = evt.clientX;
//     const y = evt.clientY + window.pageYOffset;
//     show({
//       origin: { x, y },
//       content: geography.properties.name,
//     });
//   },
//   handleLeave: () => hide(),
//   handleSelect: x => console.log('x', x),
// });

export default Map;

// export default connect(
//   null,
//   action,
// )(Map);
