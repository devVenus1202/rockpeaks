import React, { Component } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import { Button } from 'reactstrap';
import QueryFilter from '@helpers/QueryFilter';
import GET_CLIP_TAGS from '@graphql/clip/ClipTagList.graphql';
import './VideoTags.style.scss';

class VideoTags extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
  };

  state = {
    status: true,
  };

  handleClickMore = () => {
    this.setState(prevState => ({
      status: !prevState.status,
    }));
  };

  renderClipTags = () => {
    const { nid } = this.props;
    const filter = new QueryFilter();
    filter.addCondition('nid', nid);

    return (
      <Query query={GET_CLIP_TAGS} variables={{ filter: filter.data() }}>
        {({ loading, error, data }) => {
          if (loading || error) return '';
          if (data && data.tagsByClip) {
            const {
              tagsByClip: {
                entities,
              },
            } = data;
            const tags = _get(entities, '0.clipTags', null);
            if (tags) {
              return tags.map((tag, ind) => (
                <div
                  className="alert alert-secondary alert-custom-sm mr-3"
                  key={ind}
                  role="alert"
                >
                  {_get(tag, 'entity.entityLabel', '')}
                </div>
              ));
            } else {
              return '';
            }
          }
        }}
      </Query>
    );
  };

  render() {
    const { tags } = this.props;
    const { status } = this.state;
    const style = status ? 'collapsed' : 'expanded';

    return (
      <div className="video-tag-wrapper">
        <div className={style}>{this.renderClipTags()}</div>
        {tags.length ? (
          <p className="mb-4">
            <Button
              onClick={this.handleClickMore}
              type="button"
              color="danger"
              size="sm"
            >
              More
            </Button>
          </p>
        ) : ''}
      </div>
    );
  }
}

export default VideoTags;
