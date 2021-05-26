import { graphql } from 'react-apollo';

import RemoveHistory from '@graphql/playlist/RemoveHistoryPlaylist.graphql';
import RemoveWatch from '@graphql/playlist/RemoveWatchPlaylist.graphql';
import RemoveFavourite from '@graphql/playlist/RemoveFavouritePlaylist.graphql';
import UpdatePlaylist from '@graphql/playlist/UpdatePlaylist.graphql';

export const removeHistoryMutate = graphql(RemoveHistory, {
  props: props => ({
    removeHistory(entityId, refetchQueries) {
      if (!props.mutate) {
        throw new Error('unreachable');
      }
      if (refetchQueries) {
        return props.mutate({
          variables: {
            entityId,
          },
          refetchQueries,
        });
      }
      return props.mutate({
        variables: {
          entityId,
        },
      });
    },
  }),
});

export const removeWatchMutate = graphql(RemoveWatch, {
  props: props => ({
    removeWatch(entityId, refetchQueries) {
      if (!props.mutate) {
        throw new Error('unreachable');
      }
      if (refetchQueries) {
        return props.mutate({
          variables: {
            entityId,
          },
          refetchQueries,
        });
      }
      return props.mutate({
        variables: {
          entityId,
        },
      });
    },
  }),
});

export const removeFavouriteMutate = graphql(RemoveFavourite, {
  props: props => ({
    removeFavourite(entityId, refetchQueries) {
      if (!props.mutate) {
        throw new Error('unreachable');
      }
      if (refetchQueries) {
        return props.mutate({
          variables: {
            entityId,
          },
          refetchQueries,
        });
      }
      return props.mutate({
        variables: {
          entityId,
        },
      });
    },
  }),
});

export const updatePlaylistMutate = graphql(UpdatePlaylist, {
  props: props => ({
    updatePlaylist(id, title, clips, refetchQueries) {
      if (!props.mutate) {
        throw new Error('unreachable');
      }

      if (refetchQueries) {
        return props.mutate({
          variables: {
            id,
            title,
            clips,
          },
          refetchQueries,
        });
      }
      return props.mutate({
        variables: {
          id,
          title,
          clips,
        },
      });
    },
  }),
});
