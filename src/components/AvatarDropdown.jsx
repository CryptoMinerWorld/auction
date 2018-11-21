// @ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Badge from 'antd/lib/badge';
import Avatar from 'antd/lib/avatar';
import { NavLink } from 'react-router-dom';

require('antd/lib/dropdown/style/css');
require('antd/lib/badge/style/css');
require('antd/lib/menu/style/css');
require('antd/lib/avatar/style/css');

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
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

  useEffect(() => {
    console.log('walletId', walletId);
    return () => {
      console.log('unmounting...');
    };
  }, []);

  return (
    <NavLink
      to={to}
      className="dn dib-ns"
      onClick={() => setVisibility(false)}
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
    >
      <Dropdown overlay={menu} visible={visibility}>
        <Badge count={5}>
          <Avatar src={userImage} className="dib" />
          <p className="dib" data-testid="avatarUsername">
            {userName}
          </p>
        </Badge>
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
