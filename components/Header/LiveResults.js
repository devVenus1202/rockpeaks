import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from 'reactstrap';

import { get as _get } from 'lodash/object';

import SEARCH_RESULTS from '@graphql/search/SearchResults.graphql';
import { handleClickLink } from '@helpers/routeHelper';

const LiveResults = ({ searchValue, searchBoxToggle, type }) => (
  <Query
    query={SEARCH_RESULTS}
    variables={{
      conditionGroup: type !== 'All'
        ? {
          conjunction: 'AND',
          groups: [
            {
              conditions: [{
                name: 'content_type',
                operator: '=',
                value: type.slice(0, -1)
                  .toLowerCase(),
              }],
            },
          ],
        }
        : {
          conjunction: 'OR',
          conditions: [
            {
              name: 'content_type',
              operator: '=',
              value: 'clip',
            },
            {
              name: 'content_type',
              operator: '=',
              value: 'artist',
            },
            {
              name: 'content_type',
              operator: '=',
              value: 'disc',
            },
            {
              name: 'content_type',
              operator: '=',
              value: 'show',
            },
          ],
        },
      end: 10,
      fulltext: {
        keys: [searchValue],
        fields: ['title'],
      },
      start: 0,
    }}
  >
    {({ loading, data }) => {
      const documents = _get(data, 'searchAPISearch.documents', []);
      return (
        <div className="search-results">
          {
            searchValue !== '' && !!loading && (
              <p>Searching...</p>
            )
          }
          {
            searchValue !== '' && !loading && !documents.length && (
              <p>Sorry, no results.</p>
            )
          }
          {
            searchValue !== '' && !loading && documents.length > 0 && (
              <UncontrolledDropdown isOpen={searchBoxToggle}>
                <DropdownToggle caret>
                  Dropdown
                </DropdownToggle>
                <DropdownMenu>
                  {
                    documents.map((item, index) => {
                      const { content_type: contentType, nid, title } = item;
                      let handleClick = null;
                      switch (contentType) {
                        case 'artist':
                          handleClick = handleClickLink('artists', nid);
                          break;
                        case 'clip':
                          handleClick = handleClickLink('video', nid);
                          break;
                        case 'show':
                          handleClick = handleClickLink('shows', nid);
                          break;
                        case 'disc':
                          handleClick = handleClickLink('discs', nid);
                          break;
                        default:
                          handleClick = null;
                      }

                      return (
                        <DropdownItem key={index} onClick={handleClick}>
                          {`${item.title} (${item.content_type})`}
                        </DropdownItem>
                      );
                    })
                  }
                </DropdownMenu>
              </UncontrolledDropdown>
            )
          }
        </div>
      );
    }}
  </Query>
);

LiveResults.propTypes = {
  searchValue: PropTypes.string.isRequired,
  searchBoxToggle: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default LiveResults;
