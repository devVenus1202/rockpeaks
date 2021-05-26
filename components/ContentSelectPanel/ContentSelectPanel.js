import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentNavbar from './ContentNavbar';
import StatsGrid from './StatsGrid';
import SwitchType from './SwitchType';
import './ContentSelectPanel.style.scss';

class ContentSelectPanel extends Component {
  render() {
    const { category, view, onSelectCategory, onChangeView } = this.props;

    return (
      <div className="secondary-nav-section content-select-panel">
        <div className="container">
          <div className="panel ">
            <ContentNavbar
              value={category}
              selectCategory={onSelectCategory}
              selectable={view === 'table'}
            />
            <StatsGrid />
            <SwitchType type={view === 'table'} onChange={onChangeView} />
          </div>
        </div>
      </div>
    );
  }
}

ContentSelectPanel.propTypes = {
  category: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  onChangeView: PropTypes.func.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default ContentSelectPanel;
