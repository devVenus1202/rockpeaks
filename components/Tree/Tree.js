import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Treebeard } from 'react-treebeard';
import decorators from 'react-treebeard/dist/components/Decorators';
import { ICONS } from '@lib/icons';
import Spinner from '@components/Spinner';
import { handleClickLink } from '@helpers/routeHelper';
import Icon from '../Icon';

import './Tree.style.scss';

const MPToggle = ({ style }) => {
  return (
    <div className="icon-wrap" style={style.base}>
      <Icon icon={ICONS.CHEVRON_RIGHT} color="#b9c5d8" />
    </div>
  );
};

MPToggle.propTypes = {
  style: PropTypes.object,
};

MPToggle.defaultProps = {
  style: {},
};

const MPHeader = ({ node }) => {
  let props = {};
  if (node && node.lastLevel) {
    props = {
      onClick: handleClickLink(...node.linkable),
    };
  }


  return (
    <div className="base flex-grow-1" {...props}>
      <div className="title d-flex">
        {Array.isArray(node.name) && node.name.map((dom, ind) => (
          <React.Fragment key={ind}>
            {dom}
          </React.Fragment>
        ))}
        {!Array.isArray(node.name) && node.name}
      </div>
    </div>
  );
};

MPHeader.propTypes = {
  node: PropTypes.object.isRequired,
};

const MPLoading = () => (
  <div className="dropdown-loader">
    <Spinner />
  </div>
);

class MPContainer extends decorators.Container {
  render() {
    const { decorators, terminal, onClick, node } = this.props;
    const headerStyle = node && node.lastLevel ? 'deepest-level' : '';

    return (
      <div
        className={`tree-container d-flex ${(node.toggled) ? 'active' : ''} ${(node.deepest) ? 'deepest' : ''} ${headerStyle}`}
        onClick={onClick}
        onKeyPress={() => { }}
        ref={ref => { this.clickableRef = ref; }}
        role="menuitem"
        tabIndex="0"
      >
        <decorators.Header node={node} className="header" />
        <span className="icon-wrap-wrap">
          {!terminal ? this.renderToggle() : null}
        </span>
      </div>
    );
  }
}

class Tree extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
  };

  render() {
    const { data, onToggle } = this.props;
    decorators.Toggle = MPToggle;
    decorators.Header = MPHeader;
    decorators.Container = MPContainer;
    decorators.Loading = MPLoading;
    return (
      <Treebeard data={data} decorators={decorators} onToggle={onToggle} />
    );
  }
}

export default Tree;
