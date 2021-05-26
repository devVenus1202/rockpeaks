import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import { Input, Button, Form, FormGroup, CustomInput, Row, Col, Label, Modal } from 'reactstrap';
import { withApollo } from 'react-apollo';
import moment from 'moment';
import { months } from '@constants/dateTime';
import { getDateFromEntity } from '@helpers/dateTimeHelper';
import LoadingOverlay from 'react-loading-overlay';

import AddMultiClip from '@graphql/clip/AddMultiClip.graphql';
import CreatePublicClipMulti from '@graphql/clip/CreatePublicClipMulti.graphql';
import { withContext } from '@components/HOC/withContext';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';
import AlertBox from '@components/Utilities/AlertBox';

const inPoints = ['in_hours', 'in_mins', 'in_secs'];
const outPoins = ['out_hours', 'out_mins', 'out_secs'];

const nextId = '5A';
class EditClips extends Component {
  constructor(props) {
    super(props);
    const { total, parentClip, videoURL, clipData } = props;
    const clips = [];
    range(0, total).forEach(() => {
      clips.push({
        ...clipData,
        url: videoURL,
        parent_clip: '',
        in_secs: 0,
        in_mins: 0,
        in_hours: 0,
        out_secs: 0,
        out_mins: 0,
        out_hours: 0,
      });
    });
    this.state = {
      clips,
      message: '',
      isLoading: false,
    };
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

  renderInput = ({ index, type, item }) => {
    const maxValue = type.indexOf('hour') >= 0 ? 10 : 60;
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
          type="select"
          placeholder="MM"
          onChange={this.handleChangeTime(index, type)}
          value={item[type]}
          className="mr-2"
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

  handleChangeTime = (index, type) => e => {
    const { clips } = this.state;

    clips[index][type] = e.target.value;
    // Auto set value `out` value to next `in` time
    if (type.indexOf('out') >= 0 && clips[index + 1]) {
      clips[index + 1][type.replace('out', 'in')] = e.target.value;
    }
    this.setState({ clips });
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

  setDateField = () => {};

  renderEditClip = (item, index) => {
    const { videoURL, clipData } = this.props;
    const date = getDateFromEntity(
      { fieldYear: clipData.field_year, fieldMonth: clipData.field_month, fieldDay: clipData.field_day },
      true,
    );
    const className = index % 2 === 1 ? 'stripped-row' : '';
    return (
      <div className={`pt-4 ${className}`}>
        <Row>
          <Col md={3}>
            <FormGroup className="d-flex align-content-center">
              <span className="p-3">{index + 1}</span>
              <Input
                type="text"
                onChange={this.handleChangeClipTitle(index)}
                placeholder="Title"
                required
                value={item.clip_title}
              />
            </FormGroup>
          </Col>
          <Col md={2}>
            <div className="alert alert-dark alert-custom-sm m-0 d-block text-nowrap td-clip-info " role="alert">
              {clipData.artist}
            </div>
          </Col>
          <Col md={2}>
            <div className="alert alert-dark alert-custom-sm m-0 d-block text-nowrap td-clip-info " role="alert">
              {clipData.show}
            </div>
          </Col>
          <Col md={2}>
            <div className="alert alert-dark alert-custom-sm m-0 d-block text-nowrap td-clip-info " role="alert">
              {date}
            </div>
          </Col>
          <Col md={3} className="pr-4">
            <FormGroup>
              <Input
                type="text"
                className="mr-2"
                placeholder="Youtube URL"
                required
                value={item.url}
                onChange={this.handleChangeClipUrl(index)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="d-flex justify-content-end">
            <div className="d-flex align-items-center mr-4">
              <Label style={{ whiteSpace: 'nowrap' }} className="pr-2 mb-0">
                In Point:
              </Label>

              {inPoints.map(type => {
                return this.renderInput({ index, type, item });
              })}
            </div>
            <div className="d-flex align-items-center">
              <Label style={{ whiteSpace: 'nowrap' }} className="pr-2 mb-0">
                Out Point:
              </Label>
              {outPoins.map(type => {
                return this.renderInput({ index, type, item });
              })}
            </div>
          </Col>
        </Row>
        <hr className="mb-0" />
      </div>
    );
  };

  createPublicClip = index => {
    // this.props.client.mutate({
    //   mutation: CreatePublicClipMulti,
    //   variables: {
    //     min: 0,
    //   },
    // });
  };

  closeAlert = () => {
    this.setState({ message: '' });
  };

  handleSave = async () => {
    const { onNext, client, setClipField } = this.props;
    const { clips } = this.state;

    this.setState({ isLoading: true });

    let isFailed = false;
    let message = '';

    for (const i in clips) {
      const item = clips[i];

      const res = await client.mutate({
        mutation: AddMultiClip,
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
        referenced_entities.forEach(item => {
          setClipField(`${item.entity_bundle}_id`, item.entity.entityId);
          if (item.new === 'true') {
            setClipField(`${item.entity_bundle}_new`, true);
          }
        });
        clips[i].nid = clip.entity.entityId;
        const { data } = await client.mutate({
          mutation: CreatePublicClipMulti,
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
    const { onBack, clipData, theme } = this.props;
    const date = getDateFromEntity(
      { fieldYear: clipData.field_year, fieldMonth: clipData.field_month, fieldDay: clipData.field_day },
      true,
    );
    const { clips, message, isLoading } = this.state;
    return (
      <React.Fragment>
        <LoadingOverlay active={isLoading} spinner text="">
          <p className="text-muted lead">Please start by entering all {clips.length} clip titles in the Title field.</p>
          <p className="text-muted lead">
            Then enter the In and Out points for each clip and press SAVE when you are done.
          </p>
          <Row className="text-muted mt-4">
            <Col md={3}>
              <span className="p-3">Title</span>
            </Col>
            <Col md={2}>Artist</Col>
            <Col md={2}>Show</Col>
            <Col md={2}>Date</Col>
            <Col md={3} className="pr-4">
              URL
            </Col>
          </Row>
          <hr />
          {clips.map((item, index) => {
            return this.renderEditClip(item, index);
          })}
          {/* <table className="table table-borderless table-hover table-responsive-xl mb-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Artist</th>
              <th scope="col">Show</th>
              <th scope="col">Date</th>
              <th scope="col">URL</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {clips.map((item, index) => {
              return (
                <>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td className="pr-2">
                     <div className="alert alert-dark alert-custom-sm m-0 d-block text-nowrap" role="alert">
                        {clipData.clip_title}
                        <Input
                          type="text"
                          onChange={this.handleChangeClipTitle}
                          placeholder="Title"
                          required
                          value={''}
                        />
                      </div> 

                      <Input
                        type="text"
                        placeholder="Title"
                        required
                        value={item.clip_title}
                        onChange={this.handleChangeClipTitle(index)}
                      />
                    </td>
                    <td>
                      <div
                        className="alert alert-dark alert-custom-sm m-0 d-block text-nowrap td-clip-info "
                        role="alert"
                      >
                        {clipData.artist}
                      </div>
                    </td>
                    <td>
                      <div
                        className="alert alert-dark alert-custom-sm m-0 d-block text-nowrap td-clip-info "
                        role="alert"
                      >
                        {clipData.show}
                      </div>
                    </td>
                    <td>
                      <div
                        className="alert alert-dark alert-custom-sm m-0 d-block text-nowrap td-clip-info "
                        role="alert"
                      >
                        {date}
                      </div>
                    </td>
                    <td colSpan="2">
                      <Input
                        type="text"
                        placeholder="Title"
                        required
                        value={item.url}
                        onChange={this.handleChangeClipUrl(index)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th></th>
                    <td colSpan="2"></td>
                    <td colSpan="2">
                      <div className="d-flex">
                        {inPoints.map(type => {
                          return this.renderInput({ index, type, item });
                        })}
                      </div>
                    </td>
                    <td colSpan="2">
                      <div className="d-flex">
                        {outPoins.map(type => {
                          return this.renderInput({ index, type, item });
                        })}
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table> */}
          <div className="text-right mt-4">
            <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
              Back
            </Button>
            <Button className="ml-4" type="button" onClick={this.handleSave} color="danger">
              Save
            </Button>
          </div>
        </LoadingOverlay>
        <Modal className={`alert-modal theme-${theme}`} isOpen={!!message}>
          {message && (
            <AlertBox type="warning" onClose={this.closeAlert}>
              <span dangerouslySetInnerHTML={{ __html: message }} />
            </AlertBox>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

EditClips.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  setClipField: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  videoInfo: PropTypes.object.isRequired,
  parentClip: PropTypes.object.isRequired,
  clipData: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
};

export default withApollo(withContext(EditClips));
