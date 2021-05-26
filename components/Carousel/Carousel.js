import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabsCarousel from './TabsCarousel';
import ClipCarousel from './ClipCarousel';

import './Carousel.style.scss';

class Carousel extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    title: '',
  };

  defaultFilter = {
    conditions: [
      {
        field: 'type',
        value: 'clip',
        operator: 'EQUAL',
      },
      {
        field: 'status',
        value: '1',
        operator: 'EQUAL',
      },
    ],
  };

  filters = {
    all: this.defaultFilter,
    'top-rated': this.defaultFilter,
    'latest-additions': this.defaultFilter,
    'live-performances': {
      conditions: [
        ...this.defaultFilter.conditions,
        {
          field: 'clip_type',
          value: ['54'],
          operator: 'EQUAL',
        },
        {
          field: 'status',
          value: '1',
          operator: 'EQUAL',
        },
      ],
    },
    'promo-videos': {
      conditions: [
        ...this.defaultFilter.conditions,
        {
          field: 'clip_type',
          value: ['64'],
          operator: 'EQUAL',
        },
        {
          field: 'status',
          value: '1',
          operator: 'EQUAL',
        },
      ],
    },
    'interviews-docs': {
      conditions: [
        ...this.defaultFilter.conditions,
        {
          field: 'clip_type',
          value: ['53', '48'],
          operator: 'IN',
        },
        {
          field: 'status',
          value: '1',
          operator: 'EQUAL',
        },
      ],
    },
  };

  sort = {
    'latest-additions': [
      {
        field: 'field_year',
        direction: 'DESC',
      },
      {
        field: 'field_month',
        direction: 'DESC',
      },
      {
        field: 'field_day',
        direction: 'DESC',
      },
    ],
    'top-rated': [
      {
        field: 'legacy_ranking',
        direction: 'DESC',
      },
    ],
  };

  constructor(props) {
    super(props);
    this.toggleTab = this.toggleTab.bind(this);

    this.state = {
      activeTab: 'all',
    };
  }

  toggleTab(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { nid, type } = this.props;
    const { activeTab } = this.state;

    return (
      <div>
        <TabsCarousel
          type={type}
          nid={nid}
          toggleTab={this.toggleTab}
          activeTab={activeTab}
        />
        <ClipCarousel
          type={type}
          nid={nid}
          sort={this.sort[activeTab]}
          filter={this.filters[activeTab]}
          activeTab={activeTab}
        />
      </div>
    );
  }
}

export default Carousel;
