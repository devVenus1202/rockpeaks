import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form, FormGroup, Select, Row, Col, Label, Modal } from 'reactstrap';
import { range } from 'lodash';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

import { months } from '@constants/dateTime';
import { withApollo, Query } from 'react-apollo';
import AddSingleClip from '@graphql/clip/AddSingleClip.graphql';
import CreatePublicClip from '@graphql/clip/CreatePublicClip.graphql';

import AlertBox from '@components/Utilities/AlertBox';
import AutoComplete from '@components/Utilities/AutoComplete';
import CheckedIcon from '@static/images/icons/svg/Checked-Circle-Icon-Normal.svg';
import GET_AUTOCOMPLETE from '@graphql/search/ExtendedAutoComplete.graphql';

const nextId = '5A';
class EditSequence extends Component {
  static propTypes = {
    clipData: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { total, parentClip, videoURL, clipData } = props;
    console.log('Clipdata', clipData);
    const clips = [];
    range(1, Number(clipData.sequence)).forEach(() => {
      clips.push({
        artist: clipData.artist,
        artist_id: clipData.artist_id,
        canonical_recording: clipData.canonical_recording,
        canonical_recording_label: clipData.canonical_recording_label,
        clip_production: clipData.clip_production,
        clip_tags: clipData.clip_tags,
        clip_title: '',
        clip_type: clipData.clip_type,
        episode: clipData.episode,
        field_day: clipData.field_day,
        field_month: clipData.field_month,
        field_year: clipData.field_year,
        legacy_image: clipData.legacy_image,
        nid: clipData.nid,
        season: clipData.season,
        sequence: clipData.sequence,
        show: clipData.show,
        show_id: clipData.show_id,
        single_multi: clipData.single_multi,
      });
    });
    this.state = {
      clips,
      message: '',
      isLoading: false,
    };
    this.prevItems = [];
  }

  renderYears = () => {
    const curYear = moment().year();
    const years = range(curYear + 1, 1925);

    return years.map(year => {
      return (
        <option value={year} key={year}>
          {year}
        </option>
      );
    });
  };

  renderMonths = () => {
    return months.map((month, ind) => {
      return (
        <option value={ind + 1} key={ind}>
          {month}
        </option>
      );
    });
  };

  handleChangeClipTitle = index => e => {
    const { clips } = this.state;
    clips[index].clip_title = e.target.value;
    this.setState({ clips });
  };

  handleChangeClipUrl = index => e => {
    const { clips } = this.state;
    clips[index].url = e.target.value;
    this.setState({ clips });
  };

  handleChangeArtist = index => value => {
    console.log(value);
    const { clips } = this.state;
    clips[index].artist = value;
    clips[index].artist_id = '';
    this.setState({ clips });
  };

  handleChangeShow = index => e => {
    const { clips } = this.state;
    clips[index].show = e;
    clips[index].show_id = '';
    this.setState({ clips });
  };

  setDate = (index, field) => e => {
    const { clips } = this.state;
    clips[index][field] = e.target.value;
    this.setState({ clips });
  };

  renderEditClip = (item, index) => {
    const { videoURL, clipData } = this.props;
    const className = index % 2 === 1 ? 'stripped-row' : '';
    return (
      <div className={`pt-4 ${className}`}>
        <Row>
          <Col md={3}>
            <FormGroup className="d-flex align-content-center">
              <span className="p-3 prefix-span">{index + 2}</span>
              <Input
                type="text"
                onChange={this.handleChangeClipTitle(index)}
                placeholder="Title"
                required
                value={item.clip_title}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>{this.renderArtistAutoComplete(index)}</FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>{this.renderShowAutoComplete(index)}</FormGroup>
          </Col>
        </Row>
        <Row className="align-content-end">
          <Col md={6} className="">
            <span className="p-3  prefix-span" style={{ opacity: 0 }}>
              URL
            </span>
            <FormGroup className="d-flex align-content-start" style={{ width: '100%' }}>
              <span className="p-3  prefix-span">URL</span>
              <Input
                type="text"
                placeholder="Youtube URL"
                required
                value={item.url}
                onChange={this.handleChangeClipUrl(index)}
              />
            </FormGroup>
          </Col>
          <Col md={2} className="">
            <span>Day</span>
            <Input
              className="mb-3 mr-0"
              value={item.field_day}
              onChange={this.setDate(index, 'field_day')}
              type="select"
              id="calendar-day-select"
              name="calendar-day-select"
            >
              <option value="">Unknown</option>
              {range(31).map((num, ind) => (
                <option value={num + 1} key={ind}>
                  {num + 1}
                </option>
              ))}
            </Input>
          </Col>
          <Col md={2} className="">
            <span>Month</span>
            <Input
              className="mb-3 mr-0"
              onChange={this.setDate(index, 'field_month')}
              type="select"
              value={item.field_month}
              id="calendar-month-select"
              name="calendar-month-select"
            >
              <option value="">Unknown</option>
              {this.renderMonths()}
            </Input>
          </Col>
          <Col md={2} className="">
            <span>Year</span>
            <Input
              className="mb-3 mr-0"
              onChange={this.setDate(index, 'field_year')}
              value={item.field_year}
              type="select"
              id="calendar-year-select"
              name="calendar-year-select"
            >
              <option value="">Unknown</option>
              {this.renderYears()}
            </Input>
          </Col>
        </Row>
        <hr className="mb-0" />
      </div>
    );
  };

  selectItem = (index, type) => item => {
    const { clips } = this.state;
    clips[index][`${type}_id`] = item.id;
    clips[index][type] = item.value;
    this.setState({ clips });
  };

  renderArtistAutoComplete = index => {
    const { clips } = this.state;
    const value = clips[index].artist;
    const id = clips[index].artist_id;
    const { artist } = this.props;
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
            if (id && this.prevItems.length > 0) {
              items = this.prevItems;
            } else {
              items = data.extendedAutocomplete;
              this.prevItems = items;
            }
          }

          return (
            <div className="position-relative">
              <AutoComplete
                items={items}
                loading={!id && !!value && loading}
                onChange={this.handleChangeArtist(index)}
                value={value}
                onSelect={this.selectItem(index, 'artist')}
              />
              {id && <img className="position-absolute row-checkIcon" src={CheckedIcon} alt="" />}
            </div>
          );
        }}
      </Query>
    );
  };

  renderShowAutoComplete = index => {
    const { clips } = this.state;
    const value = clips[index].show;
    const id = clips[index].show_id;
    const variables = {
      target_type: 'node',
      bundle: 'show',
      value,
    };

    return (
      <Query query={GET_AUTOCOMPLETE} variables={variables} fetchPolicy="network-only">
        {({ loading, error, data }) => {
          let items;
          if (loading || error) items = this.prevItems;
          else if (data) {
            if (id && this.prevItems.length > 0) {
              items = this.prevItems;
            } else {
              items = data.extendedAutocomplete;
              this.prevItems = items;
            }
          }

          return (
            <div className="position-relative">
              <AutoComplete
                loading={!!value && loading && !id}
                items={items}
                onChange={this.handleChangeShow(index)}
                onKeyPress={this.handleKeyPress}
                value={value}
                onSelect={this.selectItem(index, 'show')}
              />
              {id && <img className="position-absolute row-checkIcon" src={CheckedIcon} alt="" />}
            </div>
          );
        }}
      </Query>
    );
  };

  handleSave = async () => {
    const { onNext, client, setClipField } = this.props;
    const { clips } = this.state;
    console.log(clips);

    this.setState({ isLoading: true });

    let isFailed = false;
    let message = '';

    for (const i in clips) {
      const item = clips[i];

      const res = await client.mutate({
        mutation: AddSingleClip,
        variables: item,
      });
      if (res.errors) {
        isFailed = true;
        return;
      }
      const {
        data: { createClip: clip },
      } = res;

      if (clip.errors.length === 0 && clip.violations.length === 0) {
        const { referenced_entities } = clip;
        clips[i].nid = clip.entity.entityId;

        referenced_entities.forEach(item => {
          clips[i][`${item.entity_bundle}_new`] = item.new === 'true';
        });

        const { data } = await client.mutate({
          mutation: CreatePublicClip,
          variables: { ...item, ...{ parent_clip: clip.entity.entityId } },
        });
        const {
          public_clip: { entity, errors, violations },
        } = data;
        if (errors.length > 0) {
          isFailed = true;
          message = decodeHtmlSpecialChars(errors[0]);
        }
      } else if (clip.errors.length > 0) {
        isFailed = true;
        message = decodeHtmlSpecialChars(clip.errors[0]);
        console.error(clip.errors[0]);
      }
    }

    this.setState({ isLoading: false, message });
    if (!isFailed) {
      setClipField('clips', clips);
      onNext(nextId);
    }
  };

  render() {
    const { clipData, onBack, theme } = this.props;
    const { clips, message, isLoading } = this.state;
    console.log('clipData', clipData);
    return (
      <LoadingOverlay active={isLoading} spinner text="">
        <div>
          <p className="text-muted lead mb-4">Thank you, your clip was saved successfully.</p>
          <p className="text-muted lead mb-4">
            Here are other clips in the sequence. Edit their information as required, then press SAVE{' '}
          </p>
          <Row className="text-muted mt-4">
            <Col md={3}>
              <span className="p-3">Title</span>
            </Col>
            <Col md={3}>Artist</Col>
            <Col md={3}>Show</Col>
          </Row>
          <hr />
          {clips.map((clip, index) => {
            return this.renderEditClip(clip, index);
          })}
          <div className="text-right mt-4">
            <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
              Back
            </Button>
            <Button className="ml-4" type="button" onClick={this.handleSave} color="danger">
              Save
            </Button>
          </div>
          <Modal className={`alert-modal theme-${theme}`} isOpen={!!message}>
            {message && (
              <AlertBox type="warning" onClose={this.closeAlert}>
                <span dangerouslySetInnerHTML={{ __html: message }} />
              </AlertBox>
            )}
          </Modal>
        </div>
      </LoadingOverlay>
    );
  }
}

export default withApollo(EditSequence);
