import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

export const withUpdateMutation = (updateMutation, WrappedComponent) => {
  class UpdateMutation extends Component {
    static propTypes = {
      forwardedRef: PropTypes.object.isRequired,
      refetchQueries: PropTypes.object.isRequired,
    };

    render() {
      const { forwardedRef, refetchQueries, ...rest } = this.props;

      return (
        <Mutation mutation={updateMutation} refetchQueries={refetchQueries}>
          {(mutate, { updateState, client }) => (
            <WrappedComponent
              ref={forwardedRef}
              {...rest}
              refetchQueries={refetchQueries}
              updateAction={mutate}
              updateState={updateState}
              client={client}
            />
          )}
        </Mutation>
      );
    }
  }
  function forwardRef(props, ref) {
    return <UpdateMutation {...props} forwardedRef={ref} />;
  }

  const name = Component.displayName || Component.name;
  forwardRef.displayName = `updateMutation(${name})`;

  return React.forwardRef(forwardRef);
};
