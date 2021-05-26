import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label, Row, Col, Button } from 'reactstrap';
import { get as _get, range } from 'lodash';
import { Link } from '@root/routes.esm';
import { getDateFromClipNode } from '@helpers/dateTimeHelper';
import { withUpdateMutation } from '@components/HOC/withUpdateMutation';
import VerticalCard from '@components/Utilities/VerticalCard';

import UpdatePublicClip from '@graphql/clip/UpdatePublicClip.graphql';
import CreatePublicClip from '@graphql/clip/CreatePublicClipMulti.graphql';

import './VideoTab.style.scss';

const inPoints = ['in_hours', 'in_mins', 'in_secs'];
const outPoins = ['out_hours', 'out_mins', 'out_secs'];
class VideoTab extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    const publicClipNodes = _get(data, 'publicClipNodes', []);
    const activePublicClip = publicClipNodes.find(clip => {
      return clip.entity.status;
    });
    let duration = {};
    if (activePublicClip) {
      duration = {
        in_hours: activePublicClip.entity.inHours,
        in_mins: activePublicClip.entity.inMins,
        in_secs: activePublicClip.entity.inSecs,
        out_hours: activePublicClip.entity.outHours,
        out_mins: activePublicClip.entity.outMins,
        out_secs: activePublicClip.entity.outSecs,
      };
    }
    this.state = {
      youtubeURL: activePublicClip ? activePublicClip.entity.url : '',
      publicClipId: activePublicClip ? activePublicClip.entity.targetId : '',
      submitAvailable: false,
      duration,
      isUpdating: false,
    };
  }

  search = () => {
    const { data } = this.props;
    const title = _get(data, 'clipTitle', '');
    const clipArtist = _get(data, 'artist.entity.title', '');
    const clipShow = _get(data, 'show.entity.title', '');
    const date = getDateFromClipNode(data);

    window.open(
      `https://www.youtube.com/results?search_query=${title} ${clipArtist} ${clipShow} ${date}`,
      '_blank', // <- This is what makes it open in a new window.
    );
  };

  handleChangeURLPaste = e => {
    this.setState({
      youtubeURL: e.target.value,
      submitAvailable: !!e.target.value.trim(),
    });
  };

  handleChangeTime = type => e => {
    const { duration } = this.state;
    duration[type] = e.target.value;
    this.setState({ duration });
  };

  renderInput = type => {
    const maxValue = type.indexOf('hour') >= 0 ? 10 : 60;
    const { duration } = this.state;
    let placeHolder = '';
    if (type.indexOf('hour') >= 0) placeHolder = 'HH';
    if (type.indexOf('min') >= 0) placeHolder = 'MM';
    if (type.indexOf('sec') >= 0) placeHolder = 'SS';
    return (
      <>
        <span className="pr-2 text-muted" style={{ opacity: 0.6 }}>
          {placeHolder}
        </span>
        <Input
          className="ml-3"
          type="select"
          placeholder="MM"
          onChange={this.handleChangeTime(type)}
          defaultValue={duration[type]}
        >
          {range(0, maxValue).map(item => {
            const value = `0${item}`.slice(-2);
            return (
              <option key={item} value={item}>
                {value}
              </option>
            );
          })}
        </Input>
      </>
    );
  };

  getImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      let img = _get(data, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  };

  submit() {
    const { client, data, updateAction, onEndSubmit } = this.props;
    const clipNid = _get(data, 'nid', '');
    const clipTitle = _get(data, 'clipTitle', 'Unknown');
    const { duration: variables, youtubeURL, publicClipId } = this.state;
    variables.url = youtubeURL;
    const publicClipNodes = _get(data, 'publicClipNodes', []);
    if (publicClipNodes.length === 0) {
      variables.parent_clip = clipNid;
      variables.clip_title = clipTitle;
      client
        .mutate({
          mutation: CreatePublicClip,
          variables,
        })
        .then(response => {
          if (typeof response === 'undefined') {
            throw 'Error: service unavaiable';
          }

          let errors = [];
          if (typeof response.errors !== 'undefined') {
            errors = response.errors;
          }

          if (errors.length > 0) {
            let error_message = 'An unexpected error occurred.';
            if (typeof errors[0].message !== 'undefined') {
              error_message = errors[0].message;
            }
            throw error_message;
          }

          if (response.data.public_clip === null) {
            throw 'Error: service unavaiable';
          }

          if (
            typeof response.data.public_clip.violations !== 'undefined' &&
            response.data.public_clip.violations instanceof Array
          ) {
            if (response.data.public_clip.violations.length > 0) {
              throw response.data.public_clip.violations[0];
            }
          }

          if (
            typeof response.data.public_clip.errors !== 'undefined' &&
            response.data.public_clip.errors instanceof Array
          ) {
            if (response.data.public_clip.errors.length > 0) {
              throw response.data.public_clip.errors[0];
            }
          }

          if (response.data.public_clip.entity === null) {
            throw 'Error: could not send the request';
          }

          const entity = response.data.public_clip.entity;
          onEndSubmit('success', 'Updated Successfully');
        })
        .catch(e => {
          onEndSubmit('warning', e);
          return;
        });
    } else {
      const public_clip = publicClipNodes[0];
      variables.nid = publicClipId;
      updateAction({
        variables,
      })
        .then(({ data }) => {
          // onEndSubmit('success', 'Updated Successfully');
          if (data.updatePublicClip.violations.length > 0) {
            onEndSubmit('warning', data.updatePublicClip.violations[0]);
          } else if (data.updatePublicClip.errors.length > 0) {
            onEndSubmit('warning', data.updatePublicClip.errors[0]);
          } else {
            onEndSubmit('success', 'Updated Successfully');
          }
        })
        .catch(err => {
          onEndSubmit('warning', 'Falied ');
        });
    }
  }

  render() {
    const { active, theme, data } = this.props;
    const { youtubeURL } = this.state;
    const style = active
      ? 'video-tab tab-pane fade show active'
      : 'video-tab tab-pane fade';

    const clipNid = _get(data, 'nid', '');
    const clipTitle = _get(data, 'clipTitle', '');
    const clipArtist = _get(data, 'artist.entity.title', '');
    const clipArtistNid = _get(data, 'artist.entity.nid', null);
    const clipShowNid = _get(data, 'show.entity.nid', null);
    const clipShowTitle = _get(data, 'show.entity.title', null);
    const date = getDateFromClipNode(data);
    const playerImgURL = this.getImage(data, [
      'smartStillImage640x480.uri',
      'fieldStillImage.url',
      'legacyImage.url.path',
    ]);

    return (
      <div className={style}>
        <div className="row m-4">
          <div className="col-md-8">
            <p className="mb-3">Issues playing back this video?</p>
            <p className="mb-3">Know of a higher quality copy on YouTube?</p>
            <p className="mb-4">
              We’re always looking to improve our database and add better
              information, including additional copies of clips.
            </p>
            <Button className="mb-4" color="danger" onClick={this.search}>
              Search
            </Button>
            <p className="mb-3">
              If you've located an{' '}
              <i
                className="exact-match"
                style={{ color: theme === 'dark' ? 'white' : 'black' }}
              >
                exact match{' '}
              </i>
              on YouTube, paste in the URL below. <br />
              Please make sure it matches the data at right:
            </p>
            <Input
              className="mb-4 "
              onChange={this.handleChangeURLPaste}
              value={youtubeURL}
              onKeyDown={this.handleKeyChange}
            />
            <p className="mb-3">
              (Remember, you can always add a{' '}
              <Link route="/addclip">
                <span
                  className="text-muted"
                  style={{
                    borderBottom: '1px solid #b93358',
                    cursor: 'pointer',
                  }}
                >
                  new clip here
                </span>
              </Link>{' '}
              if you find something cool that isn’t a copy of this specific
              recording.)
            </p>
            {/* <p className="mb-3">
              Optionally set In and Out points if you need to reference just
              part of the YouTube video in order to match the clip above
            </p> */}
          </div>
          <div className="col-md-3 offset-1">
            <div>
              <VerticalCard
                clip={{
                  nid: clipNid,
                  title: clipTitle,
                  show: { nid: clipShowNid, title: clipShowTitle },
                  artist: { nid: clipArtistNid, title: clipArtist },
                  thumbnail: playerImgURL,
                  fieldYear: data.fieldYear,
                  fieldMonth: data.fieldMonth,
                  fieldDay: data.fieldDay,
                  date,
                }}
              />
            </div>
          </div>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted row m-4">
          <div className="col-md-12">
            <FormGroup className="mb-2">
              <Label className="mb-3" for="shortname">
                Optionally set the in and out points if you want to reference a
                section of an embeddable clip:
              </Label>
              {/* <Row className="mt-3 mb-3">
                <span className="pl-3 pt-3 point-label">In Point:</span>

                {inPoints.map(type => {
                  return <Col md={2}>{this.renderInput(type)}</Col>;
                })}
              </Row> */}
              <Row className="mb-4">
                <Col md={1} className="d-flex align-items-center">
                  <Label style={{ whiteSpace: 'nowrap' }} className="pr-2 mb-0">
                    In Point:
                  </Label>
                </Col>
                <Col md={10} className="d-flex justify-content-start">
                  <div className="d-flex align-items-center mr-4">
                    {inPoints.map(type => {
                      return this.renderInput(type);
                    })}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={1} className="d-flex align-items-center">
                  <Label style={{ whiteSpace: 'nowrap' }} className="pr-2 mb-0">
                    Out Point:
                  </Label>
                </Col>
                <Col md={10} className="d-flex justify-content-start">
                  <div className="d-flex align-items-center">
                    {outPoins.map(type => {
                      return this.renderInput(type);
                    })}
                  </div>
                </Col>
              </Row>
              {/* <Row className="mt-3 mb-3">
                <span className="pl-3 pt-3 point-label">Out Point:</span>
                {outPoins.map(type => {
                  return <Col md={2}>{this.renderInput(type)}</Col>;
                })}
              </Row> */}
            </FormGroup>
          </div>
        </div>
      </div>
    );
  }
}

VideoTab.propTypes = {
  active: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
};

export default withUpdateMutation(UpdatePublicClip, VideoTab);
