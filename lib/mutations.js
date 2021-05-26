import REQUEST_SETFLAG from '../graphql/tracking/SetFlagMutation.graphql';
import REQUEST_UNSETFLAG from '../graphql/tracking/UnsetFlagMutation.graphql';

export const setFlagEntity = async (client, entityId) => {
  const response = await client.mutate({
    mutation: REQUEST_SETFLAG,
    variables: {
      entityId,
    },
  });
  return response;
};

export const unsetFlagEntity = async (client, entityId) => {
  const response = await client.mutate({
    mutation: REQUEST_UNSETFLAG,
    variables: {
      entityId,
    },
  });
  return response;
};
