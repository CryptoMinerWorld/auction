import React, { Component } from 'react';
import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { MAP_COUNTRY_DATA } from '../queries';

require('antd/lib/table/style/css');
require('antd/lib/input/style/css');
require('antd/lib/button/style/css');
require('antd/lib/icon/style/css');

const BuyNowButton = ({ record, handleCityClick }) => (
  <Button
    type="dashed"
    icon="plus"
    style={{
      color: '#ff00cd',
      borderColor: '#ff00cd',
    }}
    ghost
    onClick={() => handleCityClick(record)}
    className="hover-black ml3 dim"
  />
);

BuyNowButton.propTypes = {
  record: PropTypes.shape({}).isRequired,
  handleCityClick: PropTypes.func.isRequired,
};

class Filter extends Component {
  state = {
    searchText: '',
  };

  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSelection = (country) => {
    const { addToCart } = this.props;
    addToCart(country);
  };

  render() {
    const {
      handleCityClick, cities, loading, setHoverCountry,
    } = this.props;

    // eslint-disable-next-line
    // console.log('cities', cities);

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',

        filterDropdown: ({
          setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
          <div className="custom-filter-dropdown">
            <Input
              // eslint-disable-next-line
              ref={ele => (this.searchInput = ele)}
              placeholder="Search name"
              value={selectedKeys[0]}
              className="db w-100"
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={this.handleSearch(selectedKeys, confirm)}
            />
            <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>
              Search
            </Button>
            <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />
        ),
        onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            });
          }
        },

        render: (text, record) => {
          const { searchText } = this.state;
          return searchText ? (
            <span className="vert w3" data-testid="filterComponent">
              {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map(
                (fragment, i) => (fragment.toLowerCase() === searchText.toLowerCase() ? (
                  <span
                      // eslint-disable-next-line
                      key={i}
                    className="highlight"
                  >
                    {fragment}
                  </span>
                ) : (
                  fragment
                )),
              )}
              {!record.sold
                && record.countryId
                && record.mapIndex && (
                  <BuyNowButton record={record} handleCityClick={this.handleSelection} />
              )}
            </span>
          ) : (
            <span
              className="
            vert
            w3"
            >
              {text}
              {!record.sold
                && (record.countryId < 171 || record.countryId > 190) && (
                  <BuyNowButton record={record} handleCityClick={this.handleSelection} />
              )}
            </span>
          );
        },
      },
      {
        title: 'Plots',
        dataIndex: 'plots',
        key: 'plots',
        sorter: (a, b) => a.plots - b.plots,
        render: text => <p className="vert  ">{`${text}`}</p>,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: text => <p className="vert  ">{`Ξ ${text && text.toFixed(2)}`}</p>,
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: 'Earns',
        dataIndex: 'roi',
        key: 'roi',
        sorter: (a, b) => a.roi - b.roi,
        render: text => <p className="vert  ">{`Ξ ${text && text.toFixed(2)}`}</p>,
      },
    ];

    // const columnx = columns.map(col => ({
    //   ...col,
    //   onHeaderCell: () => ({
    //     width: '1rem',
    //   }),
    // }));

    return (
      <div
        data-testid="filterComponent"
        className="o-80 ph4-ns pv3-ns w-100"
        style={{ backgroundColor: '#2A2C36' }}
      >
        <Table
          rowClassName="pointer hover-black white"
          columns={columns}
          dataSource={cities}
          onRow={record => ({
            onClick: () => handleCityClick(record),
            onMouseEnter: () => setHoverCountry(record.countryId),
            onMouseLeave: () => setHoverCountry(),
          })}
          rowKey={record => record.countryId}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
  }
}

// pollInterval
const EnhancedFilter = props => (
  <Query query={MAP_COUNTRY_DATA}>
    {({ data, loading }) => (
      <Filter cities={data ? data.mapCountries : props.countryData} {...props} loading={loading} />
    )}
  </Query>
);

export default EnhancedFilter;

Filter.propTypes = {
  addToCart: PropTypes.func.isRequired,
  cities: PropTypes.arrayOf(PropTypes.shape({})),
  handleCityClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setHoverCountry: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  cities: [],
};
