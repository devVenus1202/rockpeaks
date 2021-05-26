import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form, FormGroup, CustomInput, Row, Col } from 'reactstrap';
import ImageBox from '@components/Utilities/ImageBox';
import VideoDescription from '../VideoDescription';

const nextIdYes = '2D';
const nextIdNo = '2E';
export default class CheckInfo extends Component {
  static propTypes = {
    hasInfo: PropTypes.bool.isRequired,
    videoInfo: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    setEditData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasInfo: props.hasInfo,
    };
  }

  selectNo = () => {
    const { setEditData } = this.props;
    setEditData('hasInfo', false);
    // If user clicks no set 1
    // this.setState({ hasInfo: false });
  };

  selectYes = () => {
    const { setEditData } = this.props;
    setEditData('hasInfo', true);
    // this.setState({ hasInfo: true });
  };

  handleNext = () => {
    const { onNext, hasInfo, setEditData } = this.props;
    // const { hasInfo } = this.state;
    if (hasInfo) {
      onNext(nextIdYes);
      setEditData('total', 2);
    } else {
      setEditData('total', 1);
      onNext(nextIdNo);
    }
  };

  render() {
    const { videoInfo, onNext, onBack, hasInfo } = this.props;
    // const { hasInfo } = this.state;
    return (
      <Form>
        <div className="form-wrapper">
          <div className="narrow-container ">
            <p className="mb-4 text-muted">
              <div>Is there information available about the different songs contained in this one video?</div>
              <div>(Check the description or the comments on the host site - often this info can be found there.)</div>
            </p>
            <p className=" text-muted">
              <div className="mb-2">If you know:</div>
              <ul>
                <li> How many songs there are </li>
                <li> The name of every song </li>
                <li> The start time of every song </li>
              </ul>
              <div>then please check "Yes" below. If you don’t have this info, please check "No" below.</div>
            </p>
            <h4 className="mb-2 mt-4 text-muted">HAVE INFO?</h4>
            <p>
              <FormGroup>
                <CustomInput
                  type="radio"
                  defaultChecked={!hasInfo}
                  onClick={this.selectNo}
                  label="No"
                  name="hasInfo"
                  className="mb-2"
                  id="hasinfo-radio"
                />
                <CustomInput
                  type="radio"
                  defaultChecked={hasInfo}
                  onClick={this.selectYes}
                  label="Yes"
                  name="hasInfo"
                  id="nonhasinfo-radio"
                />
              </FormGroup>
            </p>
          </div>
          <VideoDescription videoInfo={videoInfo} />
        </div>
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={this.handleNext} color="danger">
            next
          </Button>
        </div>
      </Form>
    );
  }
}
