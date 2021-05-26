import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, FormGroup, Row, Col } from 'reactstrap';
import ImageBox from '@components/Utilities/ImageBox';
import moment from 'moment';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

export default class VideoDescription extends Component {
  static propTypes = {
    videoInfo: PropTypes.object.isRequired,
  };

  render() {
    const { videoInfo } = this.props;
    const { publishInfo = {} } = videoInfo;
    const { fieldYear, fieldMonth, fieldDay } = publishInfo;
    const publishDate = fieldYear ? moment(new Date(fieldYear, fieldMonth - 1, fieldDay)).format('MMMM DD, YYYY') : '';
    const publishDateString = publishDate
      ? `Published on ${publishDate}`
      : `Published on ${moment(Number(videoInfo.upload_date) * 1000).format('MMMM DD, YYYY')}`;
    const publishDateDescription = `${(
      publishInfo.title ||
      videoInfo.title ||
      ''
    ).trim()}\n\n ${publishDateString}\n\n`;
    if (!videoInfo.description) {
      return '';
    }
    return (
      <div>
        <p className="text-muted lead mb-2 mt-4 ">Descriptive info from the source site:</p>
        <Row>
          <Col md={8}>
            <FormGroup>
              <Input
                type="textarea"
                rows={6}
                value={`${decodeHtmlSpecialChars(publishDateDescription)} ${decodeHtmlSpecialChars(
                  videoInfo.description,
                )}`}
                required
                readOnly
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <div className="uploaded-file-video mb-5">
              <ImageBox src={videoInfo.thumbnail} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
