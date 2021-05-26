import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, CustomInput } from 'reactstrap';

const text1 =
  'If this Disc has been released commercially either as a physical media product or a packaged digital download, check the first box.';
const text2 =
  'If the video contents of this disc are not to your knowledge available for purchase, then select trade-friendly.';
const text3 =
  'Check the box below if this disc has been released in the past 12 months, or is new to circulation.';

class SelectType extends Component {
  constructor(props) {
    super(props);
    const { selectedType = 'Trade-Friendly' } = props;
    this.state = {
      selectedType,
    };
  }

  selecteType = type => e => {
    this.setState({
      selectedType: type,
    });
  };

  handleNext = e => {
    const { onNext, setDiscData } = this.props;
    const { selectedType } = this.state;
    setDiscData('selectedType', selectedType);
    onNext();
  };

  render() {
    const { onNext, onBack } = this.props;
    const { selectedType } = this.state;
    return (
      <Form>
        <div className="narrow-container mb-8rem">
          <p className="text-muted lead mb-4">{text1}</p>
          <p className="text-muted lead mb-4">{text2}</p>
          <FormGroup>
            <CustomInput
              type="radio"
              label="Commercial"
              id="commercial"
              name="commercial"
              inline
              checked={selectedType === 'Commercial'}
              onClick={this.selecteType('Commercial')}
            />
            <CustomInput
              type="radio"
              label="Trade Friendly"
              id="trade_friendly"
              name="trade_friendly"
              inline
              checked={selectedType === 'Trade-Friendly'}
              onClick={this.selecteType('Trade-Friendly')}
            />
          </FormGroup>
          {/* <p className="text-muted lead">
            {text3}
          </p>
          <FormGroup className="mb-0">
            <CustomInput
              type="checkbox"
              label="New Release"
              id="new_release"
              name="new_release"
            />
          </FormGroup> */}
        </div>
        <div className="text-center text-md-right">
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
            onClick={this.handleNext}
            color="danger"
          >
            next
          </Button>
        </div>
      </Form>
    );
  }
}

SelectType.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  selectedType: PropTypes.string.isRequired,
  setDiscData: PropTypes.func.isRequired,
};

export default SelectType;
