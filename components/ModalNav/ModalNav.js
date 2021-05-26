import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CheckedIcon from '@static/images/icons/svg/Checked-Circle-Icon-Normal.svg';

class ModalNav extends Component {
  render() {
    const { curTab, onChange, tabs, type, plexAccount } = this.props;
    const typeMod = type || 'horizontal';

    const control = {
      horizontal: (
        <div className="nav nav-tabs">
          {tabs.map((tabName, ind) => {
            const active = curTab === ind ? 'active' : '';
            if (typeof tabName === 'object') {
              return tabName.disabled ? (
                ''
              ) : (
                <li className={`nav-item ${tabName.disabled ? 'disabled' : ''}`} key={ind}>
                  {tabName.disabled ? (
                    <a className="nav-item nav-link  " onClick={onChange(ind)} key={ind} role="tab">
                      <span className="pr-2">{tabName.name}</span>
                      {tabName.isPlexItem && plexAccount ? (
                        <img className="ml-2" className="checkIcon" src={CheckedIcon} />
                      ) : (
                        ''
                      )}
                    </a>
                  ) : (
                    <a className={`nav-item nav-link ${active}`} onClick={onChange(ind)} key={ind} role="tab">
                      <span className="pr-2">{tabName.name}</span>
                      {tabName.isPlexItem && plexAccount ? (
                        <img className="ml-2" className="checkIcon" src={CheckedIcon} />
                      ) : (
                        ''
                      )}
                    </a>
                  )}
                </li>
              );
            }
            return (
              <a className={`nav-item nav-link ${active}`} onClick={onChange(ind)} key={ind} role="tab">
                {tabName}
              </a>
            );
          })}
        </div>
      ),
      vertical: (
        <ul className="nav nav-tabs active-border-right d-block h-100">
          {tabs.map((tabName, ind) => {
            const active = curTab === ind ? 'active' : '';
            if (typeof tabName === 'object') {
              return (
                <li className={` ${tabName.disabled ? 'disabled' : ''}`} key={ind}>
                  {tabName.disabled ? (
                    tabName.name
                  ) : (
                    <>
                      <a className={`nav-item nav-link ${active}`} onClick={onChange(ind)} key={ind} role="tab">
                        {tabName.name}
                      </a>
                    </>
                  )}
                </li>
              );
            }
            return (
              <li className="nav-item" key={ind}>
                <a className={`nav-item nav-link ${active}`} onClick={onChange(ind)} key={ind} role="tab">
                  {tabName}
                </a>
              </li>
            );
          })}
        </ul>
      ),
    };

    return <nav className={`modal-nav modal-nav-${type}`}>{control[typeMod]}</nav>;
  }
}

ModalNav.propTypes = {
  curTab: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

ModalNav.defaultProps = {
  type: 'horizontal',
};

export default ModalNav;
