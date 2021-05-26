import React, { Component } from 'react';
import { Query, withApollo } from 'react-apollo';
import { get as _get } from 'lodash';
import PropTypes from 'prop-types';
import { Input, Button, Form, FormGroup, Row, Col } from 'reactstrap';
import ImageBox from '@components/Utilities/ImageBox';
import QueryFilter from '@helpers/QueryFilter';
import GET_MUSIC_TYPE from '@graphql/GetMusicType.graphql';
import GET_CLIP_TYPES from '@graphql/types/ClipTypes.graphql';
import GET_CLIP_PROPERTY from '@graphql/types/ClipProperty.graphql';
import GET_CLIP_PRODUCTIONS from '@graphql/types/ClipProduction.graphql';
import VideoDescription from '../VideoDescription';

const text1 = 'Please select values for the clip type and the clip production.';

const nextId = '2B';
const nextIdSequence = '2G';
class SelectType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clipType: '',
    };
  }

  handleChangeClipType = event => {
    const { setClipField } = this.props;
    const clipType = event.target.value;
    this.setState({ clipType });
    setClipField('clip_type', clipType);
  };

  handleChangeClipProduction = event => {
    const { setClipField } = this.props;
    setClipField('clip_production', event.target.value);
  };

  handleGotoNext = async () => {
    const { client, setMusicType, onNext } = this.props;
    const { clipType } = this.state;

    const data = await client.query({
      query: GET_MUSIC_TYPE,
      variables: { name: clipType },
    });

    // const type = await client.query({
    //   query: GET_CLIP_PROPERTY,
    //   variables: {
    //     filter: {
    //       conditions: [
    //         {
    //           field: 'vid',
    //           value: 'clip_type',
    //           operator: 'EQUAL',
    //         },
    //         {
    //           field: 'name',
    //           value: clipType,
    //           operator: 'EQUAL',
    //         },
    //       ],
    //     },
    //   },
    // });

    if (data) {
      const type = _get(data, 'data.getClipType', null);
      setMusicType(type);

      if (type === 'Music') onNext(nextId);
      else onNext(nextIdSequence);
    }
  };

  renderClipTypes = () => {
    const filter = new QueryFilter();
    filter.addCondition('vid', 'clip_type');
    filter.addCondition('name', 'Non-Music', 'NOT_EQUAL');
    filter.addCondition('name', 'Music', 'NOT_EQUAL');
    const { clipType } = this.props;
    return (
      <Query query={GET_CLIP_TYPES} variables={{ filter: filter.data() }}>
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <Input
                type="select"
                onChange={this.handleChangeClipType}
                id="clip-type-selector"
                name="clip-type-selector"
                value={clipType}
                defaultValue={clipType}
              >
                <option value={0} key={1}>
                  - None -
                </option>
                <option value={clipType} key={clipType}>
                  {clipType}
                </option>
              </Input>
            );
          }
          if (error) return '';

          const types = _get(data, 'taxonomyTermQuery.entities', []);
          return (
            <Input
              type="select"
              onChange={this.handleChangeClipType}
              id="clip-type-selector"
              name="clip-type-selector"
              value={clipType}
              defaultValue={clipType}
            >
              <option value="none" key="none">
                - None -
              </option>
              {types.map((type, ind) => {
                const { name } = type;
                return clipType === type ? (
                  <option value={name} key={ind} selected>
                    {name}
                  </option>
                ) : (
                  <option value={name} key={ind}>
                    {name}
                  </option>
                );
              })}
            </Input>
          );
        }}
      </Query>
    );
  };

  renderClipProductions = () => {
    const filter = new QueryFilter();
    filter.addCondition('vid', 'clip_production');
    const { clipProduction } = this.props;
    return (
      <Query query={GET_CLIP_PRODUCTIONS} variables={{ filter: filter.data() }}>
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <Input
                type="select"
                onChange={this.handleChangeClipProduction}
                id="clip-production-selector"
                name="clip-production-selector"
                value={clipProduction}
              >
                <option value={0} key={1}>
                  - None -
                </option>
                <option value={clipProduction} key={clipProduction}>
                  {clipProduction}
                </option>
              </Input>
            );
          }
          if (error) return '';

          const types = _get(data, 'taxonomyTermQuery.entities', []);
          return (
            <Input
              type="select"
              onChange={this.handleChangeClipProduction}
              id="clip-production-selector"
              name="clip-production-selector"
              value={clipProduction}
            >
              <option value="none" key="none">
                - None -
              </option>
              {types.map((type, ind) => {
                const { name } = type;
                return (
                  <option value={name} key={ind}>
                    {name}
                  </option>
                );
              })}
            </Input>
          );
        }}
      </Query>
    );
  };

  render() {
    const { onBack, videoInfo, clipType } = this.props;

    return (
      <Form>
        <div className="form-wrapper">
          <div className="narrow-container mb-4">
            <Row>
              <Col md={6}>
                <FormGroup>
                  <h6 className="label-title">Clip Type:</h6>
                  {this.renderClipTypes()}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <h6 className="label-title">Clip Production:</h6>
                  {this.renderClipProductions()}
                </FormGroup>
              </Col>
            </Row>
            <p className="text-muted lead mb-4">{text1}</p>
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

SelectType.propTypes = {
  setMusicType: PropTypes.func.isRequired,
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  videoInfo: PropTypes.object.isRequired,
  clipType: PropTypes.string.isRequired,
};

export default withApollo(SelectType);
