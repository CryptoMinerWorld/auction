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
import Button from 'antd/lib/button';

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
};

const colorScale = chroma
  .scale(['#3d2a00', '#23292e', '#0b3400', '#290058', '#440300', '#4a1a00', '#23292e', '#00103d'])
  .mode('lch')
  .colors(8);

const boughtColorScale = chroma
  .scale(['#ffe107', '#23292e', '#78ff0e', '#8416ff', '#ff1d12', '#ff690d', '#23292e', '#0042fc'])
  .mode('lch')
  .colors(8);

const Continents = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'Seven seas (open ocean)',
  'South America',
];

const Map = ({
  data,
  setSelection,
  addToCart,
  countryBeingHoveredOnInFilter = 9999,
  zoom,
  handleReset,
  coordinates,
  cart,
}) => {
  const decideColor = (properties, hover, continents, picked) => {
    if (properties.countryId === hover) {
      return chroma('#ff00cd');
    }
    if (picked.some(country => country.countryId === properties.countryId)) {
      return chroma('#bc0080');
    }
    if (properties.countryId === 200) {
      return '#23292e';
    }
    if (properties.sold === true) {
      return boughtColorScale[continents.indexOf(properties.continent)];
    }
    return colorScale[continents.indexOf(properties.continent)];
  };

  return (
    <div style={wrapperStyles} data-testid="mapComponent">
      {zoom !== 1 && (
        <Button
          type="dashed"
          icon="zoom-out"
          ghost
          onClick={handleReset()}
          className="hover-blue white ml3 w-100 mv3"
        >
          Reset
        </Button>
      )}
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
            height={520}
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: '#24292f',
            }}
          >
            <ZoomableGroup center={[x, y]} zoom={zoom}>
              <Geographies geography={data} disableOptimization>
                {(geographies, projection) => geographies.map(
                  geography => geography.properties.countryId !== 200 && (
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
                      onMouseLeave={() => setSelection({
                        name: 'Hover over a Country',
                        plots: 0,
                        price: 0,
                        roi: 0,
                        countryId: '',
                      })
                          }
                      onClick={() => addToCart({
                        id: geography.properties.countryId,
                        countryId: geography.properties.countryId,
                        name: geography.properties.name,
                        price: geography.properties.price,
                        plots: geography.properties.totalPlots,
                        roi: geography.properties.roi,
                        sold: geography.properties.sold,
                        mapIndex: geography.properties.mapIndex,
                      })
                          }
                      projection={projection}
                      data-testid={geography.properties.name}
                      style={{
                        default: {
                          // eslint-disable-next-line
                              fill: decideColor(
                            geography.properties,
                            countryBeingHoveredOnInFilter,
                            Continents,
                            cart,
                          ),
                          stroke: '#24292f',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                        hover: {
                          fill: chroma('#d70997').darken(0.5),
                          stroke: '#d70997',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                        pressed: {
                          fill: chroma(
                            colorScale[Continents.indexOf(geography.properties.continent)],
                          ).brighten(0.5),
                          stroke: '#24292f',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                      }}
                    />
                  ),
                )
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        )}
      </Motion>
    </div>
  );
};

Map.propTypes = {
  data: PropTypes.shape({}).isRequired,
  setSelection: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  handleReset: PropTypes.func.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  countryBeingHoveredOnInFilter: PropTypes.number.isRequired,
  cart: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Map;
