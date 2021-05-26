import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';
import { get } from 'lodash';
import { Query } from 'react-apollo';

import './CuratingTab.style.scss';
import NavCarousel from '@components/NavCarousel';
import { withContext } from '@components/HOC/withContext';
import MediaActivity from '@components/Medias/MediaActivity';
import GetCuratedContent from '@graphql/curate/GetCuratedContent.graphql';
import { transformArray } from '@helpers/arrayHelper';

import MediaThumbnail from './MediaThumbnail';
import { SlideLoader } from '@components/Loader';

const mediaData = [
  {
    imgURL: 'https://via.placeholder.com/210x160',
    value: 'Briggs, Bishop1',
    status: 'No updates',
  },
  {
    imgURL: 'https://via.placeholder.com/210x160',
    value: 'Briggs, Bishop2',
    status: 'No updates',
  },
  {
    imgURL: 'https://via.placeholder.com/210x160',
    value: 'Briggs, Bishop3',
    status: 'No updates',
  },
  {
    imgURL: 'https://via.placeholder.com/210x160',
    value: 'Briggs, Bishop4',
    status: 'No updates',
  },
  {
    imgURL: 'https://via.placeholder.com/210x160',
    value: 'Briggs, Bishop5',
    status: 'No updates',
  },
  {
    imgURL: 'https://via.placeholder.com/210x160',
    value: 'Briggs, Bishop6',
    status: 'No updates',
  },
  {
    imgURL: 'https://via.placeholder.com/210x160',
    value: 'Briggs, Bishop7',
    status: 'No updates',
  },
  {
    imgURL: 'https://via.placeholder.com/210x160',
    value: 'Briggs, Bishop8',
    status: 'No updates',
  },
];

class CuratingTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };
  }

  handleChangeTab = activeTab => () => {
    this.setState({ activeTab });
  };

  getActiveStyle = ind => {
    const { activeTab } = this.state;

    return activeTab === ind ? 'tab-pane fade show active' : 'tab-pane fade';
  };

  render() {
    const { activeTab } = this.state;
    const { active, type, user } = this.props;
    const style = active ? 'show active' : '';
    const sliderSettings = {
      arrows: true,
      initialSlide: 0,
      infinite: false,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
    };

    return (
      <div className={`tab-pane fade setting-tracking-tab ${style}`}>
        <Query
          query={GetCuratedContent}
          variables={{
            filter: {
              conditions: [
                {
                  field: 'status',
                  value: true,
                  operator: 'EQUAL',
                },
                {
                  field: 'curator',
                  value: user.user_id,
                  operator: 'EQUAL',
                },
              ],
            },
            limit: '20',
          }}
        >
          {({ loading, error, data }) => {
            if (error) return <div>Something is wrong.</div>;
            const entities = get(data, 'nodeQuery.entities', []);
            const items = transformArray(entities, [
              { source: 'entityLabel', target: 'title' },
              { source: 'entityId', target: 'nid' },
              { source: 'entityBundle', target: 'type' },
              { source: 'legacy_image.uri', target: 'still_image' },
            ]);
            const artistCount = items.reduce((sum, item) => {
              if (item.type === 'artist') return sum + 1;
              return sum;
            }, 0);
            const showCount = items.length - artistCount;
            return (
              <>
                <div
                  className={`narrow-container text-muted ${
                    type !== 'profile' ? 'p-2rem' : 'mb-md-4'
                  }  all-width`}
                >
                  <Row>
                    <Col md={6}>
                      <FormGroup className="d-inline-block mb-md-0">
                        <Input type="select">
                          <option>Recently Updated</option>
                          <option>Alphabetical</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <div className="col-md-6 d-flex align-items-top justify-content-md-end mx-md-n5">
                      <div className="px-md-3">Curating: </div>
                      <div>
                        <p className="h5 ">{artistCount} Artists</p>
                        <p className="h5 ">{showCount} Shows</p>
                      </div>
                    </div>
                  </Row>
                </div>
                <div className="narrow-container text-muted pb-0 all-width">
                  {items.length > 0 && !loading && (
                    <NavCarousel
                      items={items}
                      isShowDropdown={type !== 'profile'}
                    />
                  )}
                  {loading && <SlideLoader />}
                </div>
                {type !== 'profile' && (
                  <div className="narrow-container text-muted all-width">
                    <div className="tab-content tab-content-secondary pb-0">
                      <div className={this.getActiveStyle(0)}>
                        <p className="h6">Recent Activity:</p>
                        <hr />
                        <p className="h6 text-center mb-3">
                          February 21st, 2018
                        </p>
                        <Row>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <p className="h6 text-center mb-3">
                          February 23st, 2018
                        </p>
                        <Row>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <p className="h6 text-center mb-3">
                          February 28st, 2018
                        </p>
                        <Row>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <div className="text-center">
                          <Button type="button" color="danger" outline>
                            Show more
                          </Button>
                        </div>
                      </div>
                      <div className={this.getActiveStyle(1)}>
                        <p className="h6">Recent Activity:</p>
                        <hr />
                        <p className="h6 text-center mb-3">
                          February 28st, 2018
                        </p>
                        <Row>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <p className="h6 text-center mb-3">
                          February 28st, 2018
                        </p>
                        <Row>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <p className="h6 text-center mb-3">
                          February 28st, 2018
                        </p>
                        <Row>
                          <Col lg={6} xl={4}>
                            <MediaActivity
                              imgUrl=""
                              title="Astronomy Domine"
                              desc="The Piper At The Gates Of Dawn"
                              status="New clip added"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <div className="text-center">
                          <Button type="button" color="danger" outline>
                            Show more
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}{' '}
              </>
            );
          }}
        </Query>
      </div>
    );
  }
}

CuratingTab.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default withContext(CuratingTab);
