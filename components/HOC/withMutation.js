import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

export const withMutation = (mutation, WrappedComponent) => {
  class MutationComponent extends Component {
    static propTypes = {
      forwardedRef: PropTypes.object.isRequired,
    };

    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <Mutation mutation={mutation}>
          {(mutate, mutateState) => (
            <WrappedComponent
              ref={forwardedRef}
              {...rest}
              mutate={mutate}
              mutateState={mutateState}
            />
          )}
        </Mutation>
      );
    }
  }
  function forwardRef(props, ref) {
    return <MutationComponent {...props} forwardedRef={ref} />;
  }

  const name = Component.displayName || Component.name;
  forwardRef.displayName = `createMutation(${name})`;

  return React.forwardRef(forwardRef);
};
