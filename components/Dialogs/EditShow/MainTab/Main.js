import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Input,
  CustomInput,
  Label,
} from 'reactstrap';
import DraftPanel from '@components/DraftPanel';

class MainTab extends Component {
  render() {
    const { active } = this.props;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    return (
      <div className={style}>
        <div className="narrow-container text-muted p-2rem">
          <FormGroup className="mb-2">
            <Label for="name">The Name of this Show:</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Live in Paris 1979"
              required
            />
          </FormGroup>
          <p className="h6 mb-0">
            Optionally add any available copyright holder info pertaining to this clip.
          </p>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <FormGroup className="mb-2">
            <Label for="shortname">Short name:</Label>
            <Input
              type="text"
              name="shortname"
              id="shortname"
              placeholder="Text"
              required
            />
          </FormGroup>
        </div>
        <div className="narrow-container text-muted p-2rem">
          <FormGroup className="mb-2">
            <Label for="tvdb">TVDB.com ID:</Label>
            <Input
              type="text"
              name="tvdb"
              id="tvdb"
              placeholder="Text"
              required
            />
          </FormGroup>
        </div>
        <div className="narrow-container text-muted p-2rem">
          <FormGroup className="mb-2">
            <Label for="wikipedia">Wikipedia:</Label>
            <Input
              type="text"
              name="wiki"
              id="wiki"
              placeholder="https://ru.wikipedia.org/wiki/Joy_Division"
              required
            />
          </FormGroup>
        </div>
        <div className="narrow-container text-muted p-2rem">
          <FormGroup className="mb-2rem">
						<h6 className="label-title">Show Type:</h6>
            <Input type="select">
              <option>- None Selected -</option>
              <option>Selected2</option>
              <option>Selected3</option>
              <option>Selected4</option>
            </Input>
          </FormGroup>
          <FormGroup className="mb-2">
            <CustomInput
              type="checkbox"
              label="Show is in production"
            />
          </FormGroup>
        </div>
        <div className="narrow-container text-muted p-2rem">
          <FormGroup>
            <Label for="listingurl">Listings URL 1:</Label>
            <Input
              type="text"
              name="url1"
              id="url1"
              placeholder="Text"
              required
            />
          </FormGroup>
          <FormGroup className="mb-0">
            <Label for="listingurl">Listings URL 2:</Label>
            <Input
              type="text"
              name="url2"
              id="url2"
              placeholder="Text"
              required
            />
          </FormGroup>
        </div>
				<hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <p className="h6">
            Write your Artist Overview below To paste in text, use the сlipboard icon to the right of "Source":
          </p>
          <DraftPanel />
        </div>
      </div>
    );
  }
}

MainTab.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default MainTab;
