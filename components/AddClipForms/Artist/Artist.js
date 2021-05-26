import React, { Component } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Row, Col, Input } from 'reactstrap';
import AutoComplete from '@components/Utilities/AutoComplete';
import CheckedIcon from '@static/images/icons/svg/Checked-Circle-Icon-Normal.svg';
import GET_AUTOCOMPLETE from '@graphql/search/ExtendedAutoComplete.graphql';
import ImageBox from '@components/Utilities/ImageBox';
import VideoDescription from '../VideoDescription';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

const text1 =
  'Enter the name of the Band or Artist. Please wait for the system to suggest a match before hitting ';
const nextId = '3C'; // To Canoncial
const nonMusicNextId = '3D'; // To clipTitle
const multiNextId = '3E';
class Artist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.artist || '',
      artistId: props.artistId,
    };
    this.prevItems = [];
  }

  handleGotoNext = () => {
    const { setClipField, onNext, type, singleMulti } = this.props;
    const { value, artistId } = this.state;

    let artistName = value;
    try {
      // Decode strings like "Don Kirshner&#039;s Rock Concert".
      artistName = decodeHtmlSpecialChars(value);
    } catch (e) {
      console.log(e);
    }
    setClipField('artist', artistName);
    setClipField('artist_id', artistId);
    if (type !== 'Music') onNext(nonMusicNextId);
    else if (singleMulti !== 'single') onNext(multiNextId);
    else onNext(nextId);
  };

  handleChangeArtist = value => {
    this.setState({ artistId: '', value });
  };

  selectArtist = artist => {
    this.setState({ artistId: artist.id, value: artist.value });
  };

  renderAutoComplete = () => {
    const { value, artistId } = this.state;
    const { artist } = this.props;
    const variables = {
      target_type: 'node',
      bundle: 'artist',
      value: value ? value.toLowerCase() : '',
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
  };

  render() {
    const { onBack, videoInfo } = this.props;
    const { artistId } = this.state;
    return (
      <div>
        <div className=" form-wrapper">
          <div className="narrow-container">
            <p className="text-muted lead mb-4">
              {text1}
              <strong className="">NEXT.</strong>
            </p>
            <Row>
              <Col md={6}>
                <FormGroup>{this.renderAutoComplete()}</FormGroup>
              </Col>
              <Col md={1}>
                {artistId && <img className="checkIcon" src={CheckedIcon} />}
              </Col>
            </Row>
          </div>
          <VideoDescription videoInfo={videoInfo} />
        </div>
        <div className="text-right">
          <Button
            className="mx-4"
            type="button"
            onClick={onBack}
            color="danger"
            outline
          >
            Back
          </Button>
          <Button
            className="ml-4"
            type="button"
            onClick={this.handleGotoNext}
            color="danger"
          >
            next
          </Button>
        </div>
      </div>
    );
  }
}

Artist.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  videoInfo: PropTypes.object.isRequired,
  artistId: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
};

export default Artist;
