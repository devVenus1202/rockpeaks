import React, { Component } from 'react';
import { Query } from 'react-apollo';
import GET_NODE_COUNT from '@graphql/NodeCount.graphql';

import './StatsGrid.style.scss';

class StatsGrid extends Component {
  renderCount = value => {
    const filter = {
      conditions: [
        {
          field: 'type',
          value,
          operator: 'EQUAL',
        },
      ],
    };

    return (
      <Query query={GET_NODE_COUNT} variables={{ filter }}>
        {({ loading, error, data }) => {
          if (loading) return '';
          if (error) return '';

          return data.nodeQuery.count;
        }}
      </Query>

    );
  }

  render() {
    return (
      <div className="total-information ml-auto mr-auto">
        <div className="total-information-cell">
          <p>
            Clips &mdash;
            {' '}
            {this.renderCount('clip')}
          </p>
        </div>
        <div className="total-information-cell">
          <p>
            Artists &mdash;
            {' '}
            {this.renderCount('artist')}
          </p>
        </div>
        <div className="total-information-cell">
          <p>
            discs &mdash;
            {' '}
            {this.renderCount('disc')}
          </p>
        </div>
        <div className="total-information-cell">
          <p>
            shows &mdash;
            {' '}
            {this.renderCount('show')}
          </p>
        </div>
      </div>
    );
  }
}

export default StatsGrid;
