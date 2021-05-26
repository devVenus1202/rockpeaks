import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Button, Form, FormGroup, Row, Col } from 'reactstrap';
import { remove as _remove } from 'lodash';

import AddBadge from '@components/Utilities/AddBadge';
import AutoComplete from '@components/Utilities/AutoComplete';
import GET_AUTOCOMPLETE from '@graphql/search/AutoComplete.graphql';
import VideoDescription from '../VideoDescription';

const text1 =
  'Add as many tags as you like, but don’t include Artist, Show or Year as they are automatically included.';
const footerText =
  "Add as many as you like, but don't include the Artist, Show or Year as they are automatically included.";

const nextId = '4A';
class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clipTags: props.clipTags,
      isMatched: false,
      value: '',
    };

    this.prevItems = [];
    this.autoCompleteInput = React.createRef();
  }

  onChangeItems = clipTags => {
    this.setState({ clipTags });
  };

  handleGotoNext = () => {
    const { setClipField, onNext } = this.props;
    const { clipTags } = this.state;

    setClipField('clip_tags', clipTags);
    onNext(nextId);
  };

  handleChangeTag = value => {
    this.setState({ value, isMatched: false });
  };

  onAddItem = () => {
    const { value, clipTags } = this.state;
    clipTags.push(value);
    this.setState({ clipTags, value: '' });
    this.autoCompleteInput.current.setFocus();
  };

  onRemoveItem = item => () => {
    const { clipTags } = this.props;

    _remove(clipTags, val => {
      return val === item;
    });

    this.setState({ clipTags });
  };

  renderBadges = () => {
    const { clipTags } = this.props;

    return (
      <div className="mb-3 item-container">
        {clipTags.map((item, ind) => {
          return (
            <div className="alert alert-light alert-dismissible fade show custom-alert" role="alert" key={ind}>
              {item}
              <button className="close text-light" onClick={this.onRemoveItem(item)} type="button" data-dismiss="alert">
                <span aria-hidden="true">×</span>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  selectItem = value => {
    this.setState({ isMatched: true, value });
  };

  renderAutoComplete = () => {
    const { value, isMatched } = this.state;
    const { tags } = this.props;
    const variables = {
      target_type: 'taxonomy_term',
      bundle: 'clip_tags',
      string: value,
    };
    return (
      <Query query={GET_AUTOCOMPLETE} variables={variables}>
        {({ loading, error, data }) => {
          let items;
          if (loading || error) items = this.prevItems;
          else if (data) {
            if (isMatched && this.prevItems.length > 0) {
              items = this.prevItems;
            } else {
              items = data.autocomplete;
              this.prevItems = items;
            }
          }

          return (
            <AutoComplete
              items={items}
              loading={!!value && loading && !isMatched}
              onChange={this.handleChangeTag}
              value={value}
              onSelect={this.selectItem}
              ref={this.autoCompleteInput}
            />
          );
        }}
      </Query>
    );
  };

  render() {
    const { onBack, videoInfo } = this.props;
    const { clipTags, value } = this.state;
    return (
      <Form>
        <div className=" form-wrapper">
          <div className="narrow-container">
            <p className="text-muted lead">{text1}</p>
            <p className="text-muted lead mb-3">Descriptive tags:</p>
            {/* <AddBadge value={clipTags} onChange={this.onChangeItems} /> */}

            <Row>
              <Col md={6}>
                <FormGroup>
                  {this.renderAutoComplete()}
                  <Button className="mt-2" onClick={this.onAddItem} type="button" color="danger" disabled={!value}>
                    add
                  </Button>
                </FormGroup>
              </Col>
            </Row>
            {this.renderBadges()}
            <div className="text-muted lead">{footerText}</div>
          </div>
          <VideoDescription videoInfo={videoInfo} />
        </div>
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={this.handleGotoNext} color="danger">
            next
          </Button>
        </div>
      </Form>
    );
  }
}

Tags.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  clipTags: PropTypes.array.isRequired,
};

export default Tags;
