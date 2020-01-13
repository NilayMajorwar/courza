import React from 'react';
import Icon from '../../elements/icon';

const SidebarOption = props => {
  const option = props.option;
  return (
    <div className="cz-sidebar-menu__option">
      <Icon name={option.icon} className="cz-sidebar-menu__option-icon"></Icon>
      <span className="cz-sidebar-menu__option-text">{option.name}</span>
    </div>
  );
};

export default SidebarOption;