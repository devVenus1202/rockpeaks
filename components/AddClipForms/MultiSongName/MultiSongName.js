import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Input, Button, Label, Form, FormGroup, Row, Col } from 'reactstrap';
import ImageBox from '@components/Utilities/ImageBox';
import ClipPredefinedTitles from '@graphql/GetClipPredefinedTitles.graphql';
import { get } from 'lodash';
import VideoDescription from '../VideoDescription';

const text1 = 'Multi-chaptered clips require a descriptive title like “Full Concert” or “Four Song Set”.';
const text2 = 'If there are just 2 or 3 songs, consider using the song titles, separated by an angle bracket';
const text3 = 'Choose a pre-defined title from the list box above, or enter a custom one if you prefer.';
const text4 = '(Please don’t include information about the artist, date or show in this field.)';
const nextId = '3A';
class MultiSongName extends Component {
  constructor(props) {
    super(props);
    const { descriptiveTitle } = props;

    this.state = {
      disableCustomTitle: !!descriptiveTitle,
    };
    this.input = React.createRef();
  }

  componentDidMount() {
    const { disableCustomTitle } = this.state;
    if (!disableCustomTitle) this.input.current.focus();
  }

  handleChangeClipTitle = event => {
    const { setClipField } = this.props;

    setClipField('clip_title', event.target.value);
  };

  handleChangeDescTitle = event => {
    const { setClipField } = this.props;
    if (event.target.value) {
      this.setState({ disableCustomTitle: true });
      setClipField('clip_title', '');
    } else {
      this.setState({ disableCustomTitle: false }, () => {
        this.input.current.focus();
      });
    }
    setClipField('descriptive_title', event.target.value);
  };

  render() {
    const { onNext, onBack, videoInfo, clipTitle, descriptiveTitle } = this.props;
    const { disableCustomTitle } = this.state;
    const variables = {
      filter: {
        conditions: [
          {
            field: 'vid',
            value: 'clip_predefined_title',
            operator: 'EQUAL',
          },
        ],
      },
    };
    return (
      <div>
        <div className="narrow-container mb-5">
          <Row>
            <Col md={5} className="d-flex align-items-center">
              <FormGroup className="flex-grow-1">
                <Label>Descriptive Title:</Label>
                <Input
                  type="select"
                  onChange={this.handleChangeDescTitle}
                  placeholder="Descriptive Title"
                  required
                  value={descriptiveTitle}
                  defaultValue={descriptiveTitle}
                >
                  <option value="" key={1}>
                    - None -
                  </option>
                  <Query query={ClipPredefinedTitles} variables={variables}>
                    {({ data, error, loading }) => {
                      if (loading || error) {
                        return (
                          <option selected value={descriptiveTitle}>
                            {descriptiveTitle}
                          </option>
                        );
                      }
                      const items = get(data, 'taxonomyTermQuery.entities', []);
                      return (
                        <>
                          {items.map(item => {
                            return (
                              <option value={item.name} selected={item.name === descriptiveTitle}>
                                {item.name}
                              </option>
                            );
                          })}
                        </>
                      );
                    }}
                  </Query>
                </Input>
              </FormGroup>
            </Col>
            <Col md={1} className="d-flex align-items-center">
              <span className="p-3 text-muted">OR</span>
            </Col>
            <Col md={5} className="d-flex align-items-center">
              <FormGroup className="flex-grow-1">
                <Label>Custom Title:</Label>
                <Input
                  type="text"
                  onChange={this.handleChangeClipTitle}
                  placeholder="Custom Title"
                  required
                  value={clipTitle}
                  disabled={disableCustomTitle}
                  innerRef={this.input}
                  onKeyDown={e => {
                    if (e.keyCode === 13) {
                      onNext(nextId);
                    }
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <p className="text-muted lead">
            OK, the video at this URL can’t currently be divided into individual song chapters.
          </p>
          <p className="text-muted lead">
            For now, it needs to be given a title that reflects the fact that it contains multiple songs.
          </p>
          <p className="text-muted lead">
            There are some commonly used predefined titles in the first list box above - please choose one of those if
            it makes sense.
          </p>
          <p className="text-muted lead">
            If not, you can enter a custom title in the text field to the right of the listbox.
          </p>
          <p className="text-muted lead">
            Please don’t include information about the artist, date or show in this field.
          </p>
          <p className="text-muted lead">
            If the clip is a medley, or there are just 2 or 3 songs, consider using the song titles, separated by an
            angle bracket &ldquo; &gt; &rdquo;
          </p>
        </div>
        <VideoDescription videoInfo={videoInfo} />
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={() => onNext(nextId)} color="danger">
            next
          </Button>
        </div>
      </div>
    );
  }
}

MultiSongName.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  videoInfo: PropTypes.object.isRequired,
};

export default MultiSongName;
