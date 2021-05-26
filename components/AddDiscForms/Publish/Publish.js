import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col } from 'reactstrap';
import { withApollo, graphql } from 'react-apollo';
import LoadingOverlay from 'react-loading-overlay';

import DragList from '@components/Utilities/DragList';
import ImageBox from '@components/Utilities/ImageBox';
import Thumbnail from '@static/images/video-poster.jpg';
import CreateDisc from '@graphql/disc/CreateDisc.graphql';
import UploadArtwork from '@graphql/disc/UploadArtwork.graphql';
import GetPlaylistClips from '@graphql/playlist/GetClips.graphql';

const text1 =
  'Please review your work. If you spot any errors, press BACK and correct them.';
const text2 = ' Otherwise press publish to submit this disc.';
const text =
  "To reorder, drag clips using the 4-way arrowhead and don't forget to save your list.";
const dummyItems = [
  '1. Love Will Tear Us Apart | Joy Division | Promo Videos from 1980 | 1980 04-??',
  '2. Love Will Tear Us Apart | Joy Division | Promo Videos from 1980 | 1980 04-??',
  '3. Love Will Tear Us Apart | Joy Division | Promo Videos from 1980 | 1980 04-??',
  '4. Love Will Tear Us Apart | Joy Division | Promo Videos from 1980 | 1980 04-??',
];

class Publish extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: dummyItems,
      loading: false,
      isPublished: false,
    };
  }

  handleChangeItems = items => {
    this.setState({ items });
  };

  publishDisc = () => {
    const { client, discData, playlistData } = this.props;
    const clips = [];
    playlistData.clips.forEach(clip => {
      clips.push(clip.entity.entityId);
    });
    this.setState({ loading: true });
    client
      .mutate({
        mutation: CreateDisc,
        variables: {
          title: discData.metaData.title,
          body: discData.metaData.description,
          isMasterDisc: true,
          discType: discData.selectedType,
          clips,
        },
      })
      .then(({ data }) => {
        client
          .mutate({
            mutation: UploadArtwork,
            variables: {
              file: discData.metaData.file,
              entity_type: 'node',
              entity_bundle: 'disc',
              field_name: 'disc_artwork',
              entity_id: data.createDisc.entity.entityId,
            },
          })
          .then(({ data }) => {
            this.setState({ isPublished: true, loading: false });
          });
      });
  };

  render() {
    const { onRefresh, onBack, discData, playlistData } = this.props;
    const { items, isPublished, loading } = this.state;

    return (
      <LoadingOverlay active={loading} spinner text="">
        <React.Fragment>
          <Form>
            {!isPublished && (
              <div className="narrow-container mb-2rem">
                <p className="text-muted lead">{text1}</p>
                <p className="text-muted lead">{text2}</p>
                <hr />
                <div className="uploaded-file-box">
                  <h5 className="text-white">{discData.metaData.title}</h5>
                  <p className="mt-4">{discData.selectedType}</p>
                  <p className="mt-4">{discData.metaData.description}</p>
                  <p className="mt-4 mb-4 previewArtwork">
                    <ImageBox src={discData.metaData.artworkPreview} />
                  </p>
                  {playlistData &&
                    playlistData.clips.map(item => {
                      return <p>{item.entity.entityLabel}</p>;
                    })}
                </div>
              </div>
            )}
            {isPublished && (
              <p className="text-muted lead mb-4">
                Thank you for your submission. Would you like to{' '}
                <span onClick={onRefresh} className="add-another">
                  add another
                </span>{' '}
                Disc?
              </p>
            )}
          </Form>

          {!isPublished && (
            <div className="text-center text-md-right mt-5">
              <Button
                className="m-4 m-sm-0"
                type="button"
                onClick={onBack}
                color="danger"
                outline
              >
                Back
              </Button>
              <Button
                className="mx-4 ml-sm-4 mr-sm-0"
                type="button"
                onClick={this.publishDisc}
                color="danger"
              >
                Save
              </Button>
            </div>
          )}
        </React.Fragment>
      </LoadingOverlay>
    );
  }
}

Publish.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  discData: PropTypes.object.isRequired,
  playlistData: PropTypes.object.isRequired,
};

const withPlexAccount = graphql(GetPlaylistClips, {
  options: ({ discData: { selectedPlaylist } }) => ({
    variables: {
      targetId: selectedPlaylist,
    },
  }),
  props: ({ data: { nodeById, loading } }) => {
    return {
      loading,
      playlistData: nodeById,
    };
  },
});
export default withApollo(withPlexAccount(Publish));
