import React from 'react';
import {
  ComposableMap, ZoomableGroup, Geographies, Geography,
} from 'react-simple-maps';
import chroma from 'chroma-js';
import PropTypes from 'prop-types';
// import { Tooltip, actions } from 'redux-tooltip';
// import { connect } from 'react-redux';


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

const Map = ({ data, setSelection, addToCart }) => (
  <div style={wrapperStyles} data-testid="mapComponent">
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
      <ZoomableGroup center={[0, 20]}>
        <Geographies geography={data} disableOptimization>
          {(geographies, projection) => geographies.map((geography, i) => (
            <Geography
                // eslint-disable-next-line
                key={i}
              geography={geography}
              onMouseEnter={() => setSelection({
                name: geography.properties.name,
                plots: geography.properties.plots,
                price: geography.properties.price,
                roi: geography.properties.roi,
              })
                }
              // onMouseLeave={() => console.log('left')}
              onClick={() => addToCart({
                key: geography.properties.name,
                country: geography.properties.name,
                price: 32,
                plots: 44,
                roi: 45,
                return: 54,
              })
                }
              projection={projection}
              data-testid={geography.properties.name}
              style={{
                default: {
                  fill: colorScale[subregions.indexOf(geography.properties.subregion)],
                  stroke: '#607D8B',
                  strokeWidth: 0.75,
                  outline: 'none',
                },
                hover: {
                  fill: chroma(
                    colorScale[subregions.indexOf(geography.properties.subregion)],
                  ).darken(0.5),
                  stroke: '#607D8B',
                  strokeWidth: 0.75,
                  outline: 'none',
                },
                pressed: {
                  fill: chroma(
                    colorScale[subregions.indexOf(geography.properties.subregion)],
                  ).brighten(0.5),
                  stroke: '#607D8B',
                  strokeWidth: 0.75,
                  outline: 'none',
                },
              }}
            />
          ))
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  </div>
);

Map.propTypes = {
  // handleMove: PropTypes.func.isRequired,
  // handleLeave: PropTypes.func.isRequired,
  // handleSelect: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
  setSelection: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
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
