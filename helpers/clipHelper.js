/**
 *  This helper is used for clip detail Info
 */
import { get } from 'lodash';

export const getActiveClipInfo = nodeById => {};

export const getYoutubeUrl = nodeById => {
  const publicClips = get(nodeById, 'publicClipNodes', []);
  const archiveClips = get(nodeById, 'archiveClipNodes', []);
  const personalClips = get(nodeById, 'personalClipNodes', []);
  const activePublicClip = publicClips.find(
    item => item.entity.status === true,
  );
  if (activePublicClip) {
    return activePublicClip.entity.url;
  }
  if (publicClips.length > 0) {
    publicClips[0].entity.url;
  }
  return '';
};
