import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

export const withCreateMutation = (createMutation, WrappedComponent) => {
  class CreateMutation extends Component {
    static propTypes = {
      forwardedRef: PropTypes.object.isRequired,
      refetchQueries: PropTypes.object.isRequired,
    };

    render() {
      const { forwardedRef, refetchQueries, ...rest } = this.props;

      return (
        <Mutation mutation={createMutation} refetchQueries={refetchQueries}>
          {(mutate, createState) => (
            <WrappedComponent
              ref={forwardedRef}
              {...rest}
              refetchQueries={refetchQueries}
              createAction={mutate}
              createState={createState}
            />
          )}
        </Mutation>
      );
    }
  }
  function forwardRef(props, ref) {
    return <CreateMutation {...props} forwardedRef={ref} />;
  }

  const name = Component.displayName || Component.name;
  forwardRef.displayName = `createMutation(${name})`;

  return React.forwardRef(forwardRef);
};
