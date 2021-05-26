import React, { Component } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { range as _range } from 'lodash';
import { Input, Button, Label, Form, FormGroup, Row, Col } from 'reactstrap';
import AutoComplete from '@components/Utilities/AutoComplete';
// import GET_AUTOCOMPLETE from '@graphql/search/AutoCompleteTest.graphql';
import GET_AUTOCOMPLETE from '@graphql/search/ExtendedAutoComplete.graphql';

import CheckedIcon from '@static/images/icons/svg/Checked-Circle-Icon-Normal.svg';
import VideoDescription from '../VideoDescription';

import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

const text1 =
  'Enter the name of the Show this clip appeared on. The system will suggest matches; please wait and then click to select.';
const text2 =
  "If this clip isn't from a traditional TV or Web “show“, please use the Concert or Festival name, or the Venue name, or the name of the Network or Company that broadcast it.";
const text3 =
  'Failing that, please supply the City the clip was recorded in, or the Country the clip is from if the city is unknown.';
const text4 =
  'If you don’t have any information about where this clip is from, just leave the field blank and it will be set to Unknown.';
const text5 =
  'If you know the Season & Episode number of the show this clip apeared on enter them below.';

const nextId = '3F';
class Show extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.show || '',
      isMatched: !!props.show,
      showId: '',
    };
    this.prevItems = [];
  }

  handleGotoNext = () => {
    const { setClipField, onNext } = this.props;
    const { value, showId } = this.state;

    let showName = value;
    try {
      // Decode strings like "Don Kirshner&#039;s Rock Concert".
      showName = decodeHtmlSpecialChars(value);
    } catch (e) {
      console.log(e);
    }
    setClipField('show', showName);

    setClipField('show_id', showId);
    onNext(nextId);
  };

  handleChangeShow = value => {
    this.setState({ value, isMatched: false });
  };

  handleKeyPress = e => {
    console.log(e.keyCode);
    // this.setState({value})
  };

  handleChangeValue = field => event => {
    const { setClipField } = this.props;
    setClipField(field, event.target.value);
  };

  selectItem = item => {
    this.setState({ isMatched: true, value: item.value, showId: item.id });
  };

  renderAutoComplete = () => {
    const { value, isMatched } = this.state;
    const { show } = this.props;

    const variables = {
      target_type: 'node',
      bundle: 'show',
      value: value ? value.toLowerCase() : '',
    };

    return (
      <Query
        query={GET_AUTOCOMPLETE}
        variables={variables}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          let items;
          if (loading || error) items = this.prevItems;
          else if (data) {
            if (isMatched && this.prevItems.length > 0) {
              items = this.prevItems;
            } else {
              items = data.extendedAutocomplete;
              this.prevItems = items;
            }
          }

          return (
            <AutoComplete
              loading={!!value && loading && !isMatched}
              items={items}
              onChange={this.handleChangeShow}
              onKeyPress={this.handleKeyPress}
              value={value}
              onSelect={this.selectItem}
            />
          );
        }}
      </Query>
    );
  };

  render() {
    const { onBack, episode, season, videoInfo } = this.props;
    const { isMatched } = this.state;
    return (
      <Form>
        <div className=" form-wrapper">
          <div className="narrow-container">
            <p className="text-muted lead mb-4">{text1}</p>
            <Row>
              <Col md={6}>
                <FormGroup>{this.renderAutoComplete()}</FormGroup>
              </Col>
              <Col md={1}>
                {isMatched && <img className="checkIcon" src={CheckedIcon} />}
              </Col>
            </Row>
            <p className="text-muted lead">{text2}</p>
            <p className="text-muted lead">{text3}</p>
            <p className="text-muted lead">{text4}</p>
            {/* <p className="text-muted lead">{text5}</p>
            <Row className="mt-4">
              <Col md={8} className="d-flex">
                <FormGroup className="flex-nowrap d-flex mr-4">
                  <Label className="col-form-label pr-4">Season:</Label>
                  <Input
                    type="select"
                    onChange={this.handleChangeValue('season')}
                    className="smaller-select"
                    value={season}
                  >
                    <option value="">&mdash;</option>
                    {_range(30).map((num, ind) => {
                      return (
                        <option value={num + 1} key={ind}>
                          {num + 1}
                        </option>
                      );
                    })}
                  </Input>
                </FormGroup>
                <FormGroup className="flex-nowrap d-flex">
                  <Label className=" col-form-label  pr-4">Episode:</Label>
                  <Input
                    type="select"
                    onChange={this.handleChangeValue('episode')}
                    className="smaller-select"
                    value={episode}
                  >
                    <option value="">&mdash;</option>
                    {_range(30).map((num, ind) => {
                      return (
                        <option value={num + 1} key={ind}>
                          {num + 1}
                        </option>
                      );
                    })}
                  </Input>
                </FormGroup>
              </Col>
            </Row> */}
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
      </Form>
    );
  }
}

Show.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  show: PropTypes.object,
};

Show.defaultProps = {
  show: '',
};

export default Show;
