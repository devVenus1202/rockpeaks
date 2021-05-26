import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

export const withRemoveMutation = (removeMutation, WrappedComponent) => {
  class RemoveMutation extends Component {
    static propTypes = {
      forwardedRef: PropTypes.object.isRequired,
    };

    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <Mutation mutation={removeMutation}>
          {(mutate, removeState) => (
            <WrappedComponent
              ref={forwardedRef}
              {...rest}
              removeAction={mutate}
              removeState={removeState}
            />
          )}
        </Mutation>
      );
    }
  }
  function forwardRef(props, ref) {
    return <RemoveMutation {...props} forwardedRef={ref} />;
  }

  const name = Component.displayName || Component.name;
  forwardRef.displayName = `removeMutation(${name})`;

  return React.forwardRef(forwardRef);
};
