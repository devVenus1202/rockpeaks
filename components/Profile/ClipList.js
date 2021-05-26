import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import GetSubscriptions from '@graphql/subscription/GetUserSubscriptions.graphql';
import GetReviews from '@graphql/review/GetClipReviewsByUser.graphql';
import GetCuratedContent from '@graphql/curate/GetCuratedContent.graphql';

export default class ClipList extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  renderPlaylist() {
    const { user_id } = this.props;
    const { sortField } = this.state;
    const query = GetSubscriptions;
    const variables = { type: ['playlist'] };
    return (
      <Query query={query} variables={variables}>
        {(data, error, loading) => {
          <div />;
        }}
      </Query>
    );
  }

  render() {
    const { activeTab, user_id } = this.props;
    const { sortField } = this.state;
    let query = GetSubscriptions;
    let variables = {};
    if (activeTab === 1) {
      query = GetSubscriptions;
      variables = { type: ['playlist'] };
    }
    if (activeTab === 2) {
      query = GetReviews;
      variables = {
        filter: {
          conditions: [
            {
              field: 'uid',
              value: user_id,
              operator: 'EQUAL',
            },
            {
              field: 'status',
              value: true,
              operator: 'EQUAL',
            },
            {
              field: 'type',
              value: 'review',
              operator: 'EQUAL',
            },
          ],
        },
        limit: 100,
        sort: [
          {
            field: sortField,
            direction: sortField === 'title' ? 'ASC' : 'DESC',
          },
        ],
      };
    }
    if (activeTab === 3) {
      query = GetCuratedContent;
      variables = {
        filter: {
          conditions: [
            {
              field: 'status',
              value: true,
              operator: 'EQUAL',
            },
            {
              field: 'curator',
              value: user_id,
              operator: 'EQUAL',
            },
          ],
        },
        limit: '1000',
      };
    }

    return (
      <Query query={query} variables={variables}>
        {(data, error, loading) => {}}
      </Query>
    );
  }
}
