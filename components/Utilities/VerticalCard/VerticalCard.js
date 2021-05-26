import React, { Component } from 'react';
import Link from 'next/link';
import { getConcatenatedURI, getCalendarLink } from '@helpers/urlHelper';
import { getDateFromEntity } from '@helpers/dateTimeHelper';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';
import './VerticalCard.style.scss';

import Date from '@components/Date';

class VerticalCard extends Component {
  render() {
    const { clip } = this.props;
    const { artist, show, fieldYear, fieldMonth, fieldDay, date } = clip;
    return (
      <a className="d-inline-block text-center vertical-card">
        <div className="card-wrapper">
          <div className="thumb-container">
            <div className="thumb">
              <Link
                href={getConcatenatedURI(
                  'video',
                  clip.nid,
                  artist ? artist.title : '',
                  show ? show.title : '',
                  clip.title,
                )}
              >
                <a>
                  <div className="image-wrapper">
                    <img
                      src={
                        clip.thumbnail || 'https://via.placeholder.com/210x160'
                      }
                      alt=""
                    />
                  </div>
                </a>
              </Link>
            </div>
          </div>

          {/* <h4>Pow R. Toc H.</h4> */}
          <Link
            href={getConcatenatedURI(
              'video',
              clip.nid,
              artist ? artist.title : '',
              show ? show.title : '',
              clip.title,
            )}
          >
            <a>
              <p className="card-text mb-2 title mt-2">{clip.title}</p>
            </a>
          </Link>
          {artist && (
            <Link
              href={getConcatenatedURI('artists', artist.nid, artist.title)}
            >
              <a>
                <p className="card-text">
                  {decodeHtmlSpecialChars(artist.title)}
                </p>
              </a>
            </Link>
          )}
          {show && (
            <Link href={getConcatenatedURI('shows', show.nid, show.title)}>
              <a>
                <p className="card-text">
                  {decodeHtmlSpecialChars(show.title)}
                </p>
              </a>
            </Link>
          )}
          {clip.date && (
            <Link
              href={getCalendarLink(
                getDateFromEntity({ fieldYear, fieldMonth, fieldDay }, false),
              )}
            >
              <a>
                <p className="card-text">
                  <Date day={fieldDay} month={fieldMonth} year={fieldYear} />
                </p>
              </a>
            </Link>
          )}
        </div>
      </a>
    );
  }
}

export default VerticalCard;
