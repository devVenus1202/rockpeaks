import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';

import GET_AUTOCOMPLETE from '@graphql/search/ExtendedAutoComplete.graphql';
import AutoComplete from '@components/Utilities/AutoComplete';

export default class ArtistAutoCompleteTag extends Component {
  static propTypes = {
    artistId: PropTypes.string.isRequired,
    artistLabel: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.artistLabel || '',
      artistId: props.artistId,
    };
    this.prevItems = [];
  }

  handleChangeArtist = value => {
    this.setState({ artistId: '', value });
  };

  selectArtist = artist => {
    const { onSelect } = this.props;
    this.setState({ artistId: artist.id, value: artist.value });
    if (onSelect) {
      onSelect(artist.id, artist.value);
    }
  };

  render() {
    const { value, artistId } = this.state;
    const variables = {
      target_type: 'node',
      bundle: 'artist',
      value,
    };

    return (
      <Query query={GET_AUTOCOMPLETE} variables={variables}>
        {({ loading, error, data }) => {
          let items;
          if (loading) items = this.prevItems;
          else if (error) items = this.prevItems;
          else if (data) {
            // To prevent open list after user clicks item
            if (artistId && this.prevItems.length > 0) {
              items = this.prevItems;
            } else {
              items = data.extendedAutocomplete;
              this.prevItems = items;
            }
          }

          return (
            <AutoComplete
              items={items}
              loading={!artistId && !!value && loading}
              onChange={this.handleChangeArtist}
              value={value}
              onSelect={this.selectArtist}
            />
          );
        }}
      </Query>
    );
  }
}
