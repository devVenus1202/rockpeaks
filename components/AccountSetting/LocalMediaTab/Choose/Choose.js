import React, { Component } from 'react';
import { Form, FormGroup, Button, CustomInput, Spinner } from 'reactstrap';
import { withApollo, Query, Mutation, graphql } from 'react-apollo';
import GetPlexAccount from '@graphql/plex/GetPlexAccount.graphql';
import SelectPlexSectionsByUuid from '@graphql/plex/SelectPlexSectionsByUuid.graphql';
import { get } from 'lodash';

class Choose extends Component {
  state = {
    sections: [],
    selectedSections: [],
    selectedSectionsUid: [],
    checkedItems: {},
    isLoading: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { plexData = {} } = nextProps;
    if (plexData.plexAccount) {
      const sections = get(plexData.plexAccount, 'sections', []);
      const selectedSections = get(plexData.plexAccount, 'selected_sections', []) || [];
      const checkedItems = [];

      selectedSections.forEach(item => {
        checkedItems[item.uuid] = true;
      });
      console.log(sections);
      this.setState({ sections, selectedSections, checkedItems });
    }
  }

  handleChange = e => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => {
      const { checkedItems } = prevState;
      checkedItems[item] = isChecked;
      return checkedItems;
    });
  };

  gotoNext = async () => {
    const { client } = this.props;
    const { checkedItems } = this.state;
    const selectedUuid = [];
    Object.keys(checkedItems).forEach(item => {
      if (checkedItems[item]) {
        selectedUuid.push(item);
      }
    });
    this.setState({ isLoading: true });
    const { data } = await client.mutate({ mutation: SelectPlexSectionsByUuid, variables: { sections: selectedUuid } });
    this.setState({ isLoading: false });
    this.props.onNext();
  };

  render() {
    const { sections, selectedSections, checkedItems, isLoading } = this.state;
    console.log(checkedItems);
    return (
      <React.Fragment>
        <div className="narrow-container text-muted p-2rem all-width pb-0">
          <h2 className="smaller mb-4 text-white">Choose Libraries</h2>
          <p className="lead mb-4">Congratulations, RockPeaks successfully connected to your Plex.tv account.</p>
          <p className="lead mb-4">Next, please select which of your media libraries contain music videos:</p>
        </div>

        <div className="narrow-container text-muted p-2rem smaller-width pt-0">
          <Form className="mb-4">
            <FormGroup className="mb-0">
              <Mutation mutation={SelectPlexSectionsByUuid}>
                {(mutate, mutateState) => {
                  return sections.map(section => {
                    return (
                      <CustomInput
                        id={`type-choose_${section.uuid}`}
                        type="checkbox"
                        className="mb-2"
                        name={section.uuid}
                        label={
                          <span className="lead" style={{ lineHeight: '15px' }}>
                            {section.server.name} : {section.title}
                          </span>
                        }
                        defaultChecked={checkedItems[section.uuid]}
                        onChange={this.handleChange}
                      />
                    );
                  });
                }}
              </Mutation>
            </FormGroup>
          </Form>
          <Button type="button" color="danger" onClick={this.gotoNext}>
            {!isLoading ? 'Next' : <Spinner size="sm" />}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

const withPlexAccount = graphql(GetPlexAccount, {
  props: ({ data: { getPlexAccount, loading } }) => {
    console.log('object', getPlexAccount);
    return {
      loading,
      plexData: getPlexAccount,
    };
  },
});
export default withApollo(withPlexAccount(Choose));
