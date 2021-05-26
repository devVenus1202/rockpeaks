import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';
import { FormGroup, Input, CustomInput } from 'reactstrap';

import DraftPanel from '@components/DraftPanel';
import AutoCompleteTag from '@components/AutoCompleteTag';

import { TagItem } from '@components/Utilities/Tag';

import { object2Array } from '@helpers/arrayHelper';

class FormReview extends Component {
  static propTypes = {
    clip: PropTypes.string.isRequired,
    reviews: PropTypes.object.isRequired,
    createAction: PropTypes.func.isRequired,
    updateAction: PropTypes.func.isRequired,
    createState: PropTypes.object.isRequired,
    updateState: PropTypes.object.isRequired,
    onEndSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.string.isRequired,
    youtubeInfo: PropTypes.object,
    mutate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { tags, entityId } = props;
    this.state = {
      nid: entityId,
      content: '',
      tags: tags || [],
      tagVal: '',
      originContent: '',
    };
    this.inputTag = React.createRef();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { reviews, initialData, youtubeInfo } = nextProps;
    const { nid } = this.state;
    if (reviews) {
      const reviewList = get(reviews, 'entities', []);
      if (!reviewList.length) return;
      const lastReview = reviewList[reviewList.length - 1];
      const tags = object2Array(lastReview.clipTags, 'entity.entityLabel');
      if (!lastReview) {
        this.setState({
          content: '',
        });
      } else if (lastReview.nid !== nid) {
        this.setState({
          nid: lastReview.nid,
          content: lastReview.body.value,
          originContent: lastReview.body.value,
          tags,
        });
      }
    } else if (initialData) {
      this.setState({
        content: initialData,
        originContent: initialData,
      });
    } else if (youtubeInfo) {
      const description = get(youtubeInfo, 'description', '');
      this.setState({
        content: description,
        originContent: description,
      });
    } else {
      this.setState({
        content: '',
        originContent: '',
      });
    }
  }

  onChangeContent = content => {
    this.setState({ content });
  };

  handleConvert = e => {
    this.setState({ newReview: e.target.checked });
  };

  submit = () => {
    const { nid, content, tags, newReview } = this.state;
    const {
      clip,
      createAction,
      onEndSubmit,
      updateAction,
      mutate,
    } = this.props;

    if (!nid) {
      if (!newReview) {
        mutate({ variables: { id: clip, body: content } }).then(data => {
          const errors = get(data, 'data.clip.errors', []);
          const violations = get(data, 'data.clip.violations', []);
          if (errors.length === 0 && violations.length === 0) {
            onEndSubmit(
              'Thank you, your review has been successfully updated.',
              'success',
              true,
            );
          } else if (violations.length > 0) {
            onEndSubmit(
              <span
                dangerouslySetInnerHTML={{ __html: violations[0].message }}
              />,
              'warning',
              false,
            );
          } else if (errors.length > 0) {
            onEndSubmit(
              'Something is wrong. Please wait for moment and try again.',
              'success',
            );
          }
          this.setState({ showAlert: true });
        });
        return;
      }
      createAction({
        variables: {
          title: 'title',
          body: content,
          clip: `${clip}`,
          clip_tags: tags,
        },
      }).then(data => {
        const errors = get(data, 'data.createClipReview.errors', []);
        const violations = get(data, 'data.createClipReview.violations', []);
        if (errors.length === 0 && violations.length === 0) {
          onEndSubmit(
            'Thank you, your review has been successfully submitted.',
            'success',
            true,
          );
        } else if (violations.length > 0) {
          onEndSubmit(violations[0].message, 'warning');
        } else if (errors.length > 0) {
          onEndSubmit(errors[0].message, 'warning');
        }
      });
    } else {
      updateAction({
        variables: {
          id: nid,
          title: 'review', //default
          body: content,
          clip: `${clip}`,
          clip_tags: tags,
        },
      }).then(data => {
        const errors = get(data, 'data.createClipReview.errors', []);
        const violations = get(data, 'data.createClipReview.violations', []);
        if (errors.length === 0 && violations.length === 0) {
          onEndSubmit(
            'Thank you, your review has been successfully updated.',
            'success',
            true,
          );
        } else if (violations.length > 0) {
          onEndSubmit('Failed. Please check Title and Tags', 'success');
        } else if (errors.length > 0) {
          onEndSubmit(
            'Something is wrong. Please wait for moment and try again.',
            'success',
          );
        }
        this.setState({ showAlert: true });
      });
    }
  };

  addTag = () => {
    const { tags = [], tagVal } = this.state;
    if (tagVal && !tags.includes(tagVal)) {
      tags.push(tagVal);
      this.setState({ tags });
    }
  };

  removeItem = ind => {
    this.setState(prevState => {
      const { tags } = prevState;
      tags.splice(ind, 1);
      return { tags };
    });
  };

  handleChangeTag = selectedTags => {
    if (selectedTags.length > 0) {
      const { tags } = this.state;
      const index = tags.findIndex(item => item === selectedTags[0].label);
      if (index < 0) {
        this.setState({ tags: [...this.state.tags, selectedTags[0].label] });
      }
    }
  };

  render() {
    const { hiddenCheckBox } = this.props;
    const { originContent, tags = [] } = this.state;
    return (
      <div className="">
        <div className="narrow-container full-width all-width p-2rem draft-container pb-0">
          <DraftPanel
            onChangeContent={this.onChangeContent}
            content={originContent}
          />
        </div>

        <div className="narrow-container all-width text-muted p-2rem ">
          <p className="mb-1">Descriptive tags:</p>
          {tags.map((tag, ind) => (
            <>
              <TagItem value={tag} onRemoveItem={() => this.removeItem(ind)} />
            </>
          ))}
          <FormGroup className="mb-2 add-tag">
            <AutoCompleteTag
              onChangeTag={this.handleChangeTag}
              options={tags}
            />
          </FormGroup>
          <br />
          {!hiddenCheckBox && (
            <FormGroup className="mt-2">
              <CustomInput
                id="convert-checkbox"
                type="checkbox"
                label="Convert this description into a review with my byline"
                onClick={this.handleConvert}
              />
            </FormGroup>
          )}
        </div>
      </div>
    );
  }
}

FormReview.defaultProps = {
  youtubeInfo: null,
};
export default FormReview;
