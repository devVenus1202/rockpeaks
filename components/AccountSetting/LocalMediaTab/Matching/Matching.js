import React, { Component } from 'react';
import { Form, Button } from 'reactstrap';
import AlertBox from '@components/Utilities/AlertBox';

class Matching extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="narrow-container text-muted p-2rem all-width pb-0">
          {/* <AlertBox text="Selected libraries are saving for matching." onClose={() => {}} /> */}
          <h2 className="smaller mb-4  text-white">Plex Matching</h2>
          <p className="lead mb-4">Your selection have been successfully saved.</p>
          <p className="lead mb-4">
            During the final step, RockPeaks will attempt to match your local libraries to our online database of clips.
          </p>
          <p className="lead mb-4">Depending on the size of you library, this may take some time.</p>
        </div>
        <div className="narrow-container text-muted p-2rem smaller-width pt-0">
          <Form>
            <Button type="button" color="danger" onClick={() => this.props.onNext()}>
              NEXT
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default Matching;
