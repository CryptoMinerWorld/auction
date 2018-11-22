// @ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Badge from 'antd/lib/badge';
import Avatar from 'antd/lib/avatar';
import { NavLink } from 'react-router-dom';
import Icon from 'antd/lib/icon';
import { fetchAnyPendingTransactions } from '../helpers';

require('antd/lib/dropdown/style/css');
require('antd/lib/badge/style/css');
require('antd/lib/menu/style/css');
require('antd/lib/avatar/style/css');

/**
 * @param {{
 * hash: string,
 * txCurrentUser:string,
 * txMethod: string,
 * txTokenId:string
 * }[]} items
 */
const menu = items => (
  <Menu data-testid="menu">
    {items.map(({
      hash, txCurrentUser, txMethod, txTokenId,
    }) => (
      <Menu.Item key={hash} className="flex aic">
        <Icon type="loading" className="dib ma0 pa0" />
        <p className="dib ma0 pa0 pl3">
          {txTokenId}
          {' '}
          {` ${hash.substring(0, 4)}...${hash.substring(hash.length - 4)}`}
          {' '}
          {txMethod}
          {' '}
          {` ${txCurrentUser.substring(0, 4)}...${txCurrentUser.substring(
            txCurrentUser.length - 4,
          )}`}
        </p>
      </Menu.Item>
    ))}
  </Menu>
);

/**
 * @param {{
 * to: string,
 * userImage: string
 * userName: string
 * walletId: string
 * }} AvatarDropdownProps
 */
const AvatarDropdown = ({
  to, userImage, userName, walletId,
}) => {
  const [visibility, setVisibility] = useState(false);
  const [penidngTxs, setTxs] = useState([]);
  useEffect(() => {
    const unsubscribe = fetchAnyPendingTransactions(walletId, setTxs);
    return () => unsubscribe();
  }, []);

  return (
    <NavLink
      to={to}
      className="dn dib-ns"
      onClick={() => setVisibility(false)}
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
      data-testid="avatar"
    >
      <Dropdown overlay={menu(penidngTxs)} visible={visibility}>
        <>
          <Badge count={penidngTxs.length}>
            <Avatar src={userImage} className="dib" />
          </Badge>
          <p className="dib pl2" data-testid="avatarUsername">
            {userName}
          </p>
        </>
      </Dropdown>
    </NavLink>
  );
};

export default AvatarDropdown;

AvatarDropdown.propTypes = {
  to: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  walletId: PropTypes.string.isRequired,
};
