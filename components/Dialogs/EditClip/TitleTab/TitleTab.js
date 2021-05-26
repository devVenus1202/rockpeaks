import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { FormGroup, Input, Row, Col } from 'reactstrap';
import { range as _range, get as _get } from 'lodash';

import { months } from '@constants/dateTime';

import { ClipType, ClipProduction } from '@components/ClipType';
import { withUpdateMutation } from '@components/HOC/withUpdateMutation';
import ArtistAutoCompleteTag from '@components/AutoCompleteTag/ArtistAutoCompleteTag';
import ShowAutoCompleteTag from '@components/AutoCompleteTag/ShowAutoCompleteTag';
import { Link } from 'next/router';

import UpdateClipInfo from '@graphql/clip/UpdateClipInfo.graphql';

import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

class TitleTab extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    const { fieldDay, fieldMonth, fieldYear, artist, show, clipTitle } = data;
    const clipType = _get(data, 'clipType.entity.entityLabel', '');
    const clipProduction = _get(data, 'clipProduction.entity.entityLabel', '');
    const clipInfo = {
      clip_title: clipTitle,
      field_year: fieldYear,
      field_month: fieldMonth,
      field_day: fieldDay,
      artist: artist.entity.title,
      artist_id: artist.entity.nid,
      show: show.entity.title,
      show_id: show.entity.nid,
      clip_type: clipType,
      clip_production: clipProduction,
    };
    this.state = {
      clipInfo,
    };
  }

  renderYears = () => {
    const curYear = moment().year();
    const years = _range(curYear + 1, 1925);

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

  changeTitle = e => {
    const { clipInfo } = this.state;
    clipInfo.clip_title = e.target.value;
    this.setState({ clipInfo });
  };

  setDateField = fieldName => e => {
    const { clipInfo } = this.state;
    clipInfo[fieldName] = e.target.value;
    this.setState({ clipInfo });
  };

  changeClipType = value => {
    const { clipInfo } = this.state;
    clipInfo.clip_type = value;
    this.setState({ clipInfo });
  };

  changeClipProduction = value => {
    const { clipInfo } = this.state;
    clipInfo.clip_production = value;
    this.setState({ clipInfo });
  };

  changeAutoComplete = field => (id, value) => {
    const { clipInfo } = this.state;
    if (field === 'show' || field === 'artist') {
      try {
        // Decode strings like "Booker T. &amp; The MG’s".
        value = decodeHtmlSpecialChars(value)
      }
      catch (e) {
        console.log(e);
      }
    }
    clipInfo[field] = value;
    clipInfo[`${field}Id`] = id;
    this.setState({ clipInfo });
  };

  submit = () => {
    const { data, updateAction, onEndSubmit } = this.props;
    const { clipInfo } = this.state;

    const variables = {
      id: data.nid,
      input: {
        clip_title: clipInfo.clip_title,
        field_year: clipInfo.field_year,
        field_month: clipInfo.field_month,
        field_day: clipInfo.field_day,
        artist: clipInfo.artist,
        show: clipInfo.show,
        clip_type: clipInfo.clip_type,
        clip_production: clipInfo.clip_production,
      },
    };
    updateAction({
      variables,
    })
      .then(({ data }) => {
        if (data.clip.violations.length > 0) {
          onEndSubmit('warning', data.clip.violations[0]);
        } else if (data.clip.errors.length > 0) {
          onEndSubmit('warning', data.clip.errors[0]);
        } else {
          onEndSubmit('success', 'Updated Successfully');
        }
      })
      .catch(err => {
        onEndSubmit('warning', 'Falied ');
      });
  };

  render() {
    const { active } = this.props;
    const { clipInfo } = this.state;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    return (
      <div className={style}>
        <div className="narrow-container text-muted p-2rem">
          <p className="mb-2rem" for="info">
            {`If you can see a way to make the title of this clip more accurate or clear, please edit the field below.`}
          </p>
          <Row>
            <Col md={10}>
              <FormGroup>
                <Input
                  type="text"
                  name="title"
                  placeholder="Atomosphere"
                  required
                  value={clipInfo.clip_title}
                  onChange={this.changeTitle}
                />
              </FormGroup>
            </Col>
          </Row>
          <p className="mb-2rem" for="info">
            {`If this is a song, and you make the title consistent with other clips of the same song, that will help with grouping and sorting.`}
          </p>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <p className="mb-2rem" for="info">
            {`If you have better date information for this clip, adjust the field below accordingly.`}
          </p>
          <p className="mb-2rem" for="info">
            {`We prefer the recording date when known, otherwise use the release or broadcast date.`}
          </p>
          <Row className="mt-3 mb-4">
            <Col md={3}>
              <h6 className="label-title">Day:</h6>
              <Input
                type="select"
                onChange={this.setDateField('field_day')}
                name="Day"
                value={clipInfo.field_day}
              >
                <option value="">Unknown</option>
                {_range(31).map((num, ind) => (
                  <option value={num + 1} key={ind}>
                    {num + 1}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md={3}>
              <h6 className="label-title">Month:</h6>
              <Input
                type="select"
                onChange={this.setDateField('field_month')}
                name="Year"
                value={clipInfo.field_month}
              >
                <option value="">Unknown</option>
                {this.renderMonths()}
              </Input>
            </Col>
            <Col md={3}>
              <h6 className="label-title">Year:</h6>
              <Input
                type="select"
                onChange={this.setDateField('field_year')}
                name="Year"
                value={clipInfo.field_year}
              >
                <option value="">Unknown</option>
                {this.renderYears()}
              </Input>
            </Col>
          </Row>
          <p className="mb-2rem" for="info">
            {`Fill in as much info as you have but leave unknown values to "Unknown" `}
          </p>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <p className="mb-2rem" for="info">
            {`If the values for clip type or clip production are incorrect, adjust them below.`}
          </p>
          <FormGroup className="mb-2">
            <Row className="mt-3">
              <Col md={6}>
                <ClipType
                  value={clipInfo.clip_type}
                  onChange={this.changeClipType}
                />
              </Col>
              <Col md={6}>
                <ClipProduction
                  value={clipInfo.clip_production}
                  onChange={this.changeClipProduction}
                />
              </Col>
            </Row>
          </FormGroup>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <p className="mb-2rem" for="info">
            If the Aritst is incorrect, start typing the correct name and look
            for the system to suggest a match.
          </p>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-6">
                <ArtistAutoCompleteTag
                  artistId={clipInfo.artist_nid}
                  artistLabel={clipInfo.artist}
                  onSelect={this.changeAutoComplete('artist')}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <p className="mb-2rem" for="info">
            If the Show is incorrect, start typing the correct name and look for
            the system to suggest a match.
          </p>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <ShowAutoCompleteTag
                  showId={clipInfo.show_nid}
                  showLabel={clipInfo.show}
                  onSelect={this.changeAutoComplete('show')}
                />
              </FormGroup>
            </Col>
          </Row>
          <p className="mb-2rem" for="info">
            Please be sure you are familiar with{' '}
            <a
              className="text-muted text-link"
              href="https://forum.rockpeaks.com/t/shows-on-rockpeaks/34"
            >
              our guidelines
            </a>{' '}
            on how Show names should be employed before changing this value.
          </p>
        </div>
      </div>
    );
  }
}

TitleTab.propTypes = {
  active: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  updateAction: PropTypes.func.isRequired,
  onEndSubmit: PropTypes.func.isRequired,
};
export default withUpdateMutation(UpdateClipInfo, TitleTab);
