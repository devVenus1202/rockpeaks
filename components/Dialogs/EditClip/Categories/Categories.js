import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label, Row, Col, Button } from 'reactstrap';
import { TagItem } from '@components/Utilities/Tag';

class Categories extends Component {
  render() {
    const { active } = this.props;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    return (
      <div className={style}>
        <div className="narrow-container text-muted p-2rem">
          <Row>
            <Col md={6}>
              <FormGroup className="mb-0">
                <Label className="mb-3" for="title">
                  Clip Type *
                </Label>
                <Input type="select">
                  <option> Official Video </option>
                  <option>Clip Type 1</option>
                  <option>Clip Type 2</option>
                  <option>Clip Type 3</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="mb-3" for="title">
                  Clip Production *
                </Label>
                <div className="mb-3">
                  <TagItem value="post-punk" onRemoveItem={() => {}} />
                  <TagItem value="Promo Videos from 1988" onRemoveItem={() => {}} />
                </div>
                <Input type="text" name="clip_production" placeholder="" required />
                <Button className="mt-4" color="danger" type="button">
                  view more
                </Button>
              </FormGroup>
            </Col>
            <p className="pl-3">
              Add as many as you like, but don't include the Artist, Show or Year as they are
              automatically included.
            </p>
          </Row>
        </div>
      </div>
    );
  }
}

Categories.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default Categories;
