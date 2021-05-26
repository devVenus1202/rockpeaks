import React, { Component } from 'react';
import { Form, Button, Progress } from 'reactstrap';
import { withApollo } from 'react-apollo';
import { get } from 'lodash';
import Loader from 'react-loader-spinner';

import MediaBar from '@static/images/icons/svg/Media-Bar.svg';

import FetchPlexMediaItems from '@graphql/plex/FetchPlexItems.graphql';
import MatchPlexMediaItems from '@graphql/plex/MatchPlexMediaItem.graphql';
import PersonalClipList from '../PlexClipList';

// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

class Initializing extends Component {
  state = {
    matching: false,
    matched: false,
    completedCount: 0,
  };

  componentDidMount() {
    this.startMatching();
  }

  startMatching = async () => {
    const { client, setInfo } = this.props;
    const { matching } = this.state;
    if (matching) return;
    this.setState({ matching: true, statusInfo: 'Getting plex media items...' });
    const { data } = await client.query({ query: FetchPlexMediaItems });
    const mediaItems = get(data, 'fetchPlexMediaItems.result', []);
    if (mediaItems.length > 0) {
      this.setState({ total: mediaItems.length });
    } else {
      this.setState({ matching: false, statusInfo: 'You do not have any Plex media items. ' });
      return;
    }

    for (let index in mediaItems) {
      const item = mediaItems[index];
      const { data } = await client.mutate({
        mutation: MatchPlexMediaItems,
        variables: { plexMediaItemKey: item.key, plexSectionUuid: item.sectionUuid },
      });
      const { matchPlexMediaItem } = data;
      const statusInfo = matchPlexMediaItem.message;
      this.setState({ completedCount: Number(index) + 1, statusInfo });
    }

    this.setState({ matching: false, matched: true });
    this.props.onNext();
  };

  gotoNext = () => {
    this.props.onNext();
  };

  render() {
    const { matching, matched, total, completedCount, statusInfo } = this.state;
    const { plexAccount } = this.props;
    return (
      <React.Fragment>
        <div className="narrow-container text-muted p-2rem all-width pb-0">
          <div className="mb-3">
            {/* <p className="mb-4">
              Your library has been connected and is ready to be scanned and matched. Depending on its size, this may
              take some time.
            </p> */}
            <p className="lead mb-4">{statusInfo}</p>

            <div className="mb-4">
              {total && <Progress value={completedCount} max={total} />}
              <div className="d-flex justify-content-between">
                <div className="lead">{total && `Completed ${completedCount} of ${total}:`}</div>
                <div className="lead">{total && `${((completedCount / total) * 100).toFixed(1)}%`}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer justify-content-start">
          <Button type="button" color="danger" onClick={this.gotoNext} disabled={matching}>
            Next
          </Button>
          {/* <Button type="button" color="danger" onClick={this.startMatching}>
            Continue
            </Button> */}
        </div>
      </React.Fragment>
    );
  }
}

export default withApollo(Initializing);
