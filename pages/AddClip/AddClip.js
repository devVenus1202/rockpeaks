import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from '@root/routes.esm';
import { Button, Row, Col } from 'reactstrap';
import App from '@components/App';
import StepBar from '@components/StepBar';
import EmbedCode from '@components/AddClipForms/EmbedCode';
import Found from '@components/AddClipForms/Found';
import SelectType from '@components/AddClipForms/SelectType';
import SongType from '@components/AddClipForms/SongType';
import CheckInfo from '@components/AddClipForms/CheckInfo';
import SetTotal from '@components/AddClipForms/SetTotal';
import MultiSongName from '@components/AddClipForms/MultiSongName';
import SingleSongName from '@components/AddClipForms/SingleSongName';
import SingleSongSequence from '@components/AddClipForms/SingleSongSequence';
import DateInput from '@components/AddClipForms/DateInput';
import Artist from '@components/AddClipForms/Artist';
import CanonicalRecording from '@components/AddClipForms/CanonicalRecording';
import Show from '@components/AddClipForms/Show';
import Tags from '@components/AddClipForms/Tags';
import Review from '@components/AddClipForms/Review';
import EditClips from '@components/AddClipForms/EditClips';
import ImageBox from '@components/Utilities/ImageBox';
import { getDateFromEntity } from '@helpers/dateTimeHelper';
import { getConcatenatedURI } from '@helpers/urlHelper';
import './AddClip.style.scss';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';
import EditSequence from '@components/AddClipForms/EditSequence';
import { get } from 'lodash';
import { PageContentLoader } from '@components/Loader';

const dummyClipData = {
  artist: ' Abidaz',
  artist_id: '402843',
  canonical_recording: '850544',
  canonical_recording_label: 'Råknas',
  clip_production: 'Amateur',
  clip_tags: ['Director: Ali Memarchi'],
  clip_title: '',
  clip_type: 'Live Performance',
  episode: 1,
  field_day: '5',
  field_month: '9',
  field_year: '2019',
  legacy_image: 'https://i.ytimg.com/vi/Qb2g6BaIL3Q/maxresdefault.jpg',
  season: 1,
  show: 'Live on KEXP (90.3 FM Seattle)',
  single_multi: 'multi',
};

const initialClipData = {
  clip_title: '',
  single_multi: 'single',
  field_year: '',
  field_month: '',
  field_day: '',
  season: '0',
  episode: '0',
  canonical_recording: '0',
  canonical_recording_label: '',
  artist: '',
  show: '',
};

class AddClip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      formId: '1A',
      formNumber: 0,
      history: {},
      videoURL: '', // https://www.youtube.com/watch?v=Qb2g6BaIL3Q, https://www.youtube.com/watch?v=s_hYeCZo2Nw
      clipData: initialClipData, // initialClipData,
      videoInfo: {},
      editData: { total: 2 },
      musicType: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { authentication } = this.props;
    const authorized = get(authentication, 'isLogin', false);
    if (!authorized) {
      Router.replace('/welcome');
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  start = () => {
    this.setState({
      step: 0,
      formId: '1A',
      formNumber: 0,
      history: {},
      videoURL: '',
      clipData: initialClipData,
      videoInfo: {},
      editData: {},
      musicType: null,
    });
  };

  goToStep = step => () => {
    this.setState({ step });
  };

  goToForm = nextId => {
    const { formNumber, history, formId } = this.state;
    const step = nextId.slice(0, 1);
    history[formNumber] = formId;
    this.setState({ formId: nextId, step: Number(step) - 1, formNumber: formNumber + 1, history });
  };

  goToBack = () => {
    const { formNumber, history } = this.state;
    const formId = history[formNumber - 1];
    this.setState({ formId, formNumber: formNumber - 1 });
  };

  handleChangeURL = event => {
    this.setState({
      videoURL: event.target.value,
      clipData: initialClipData,
      videoInfo: {},
      editData: {},
      musicType: null,
    });
  };

  setVideoInfo = videoInfo => {
    this.setState({ videoInfo });
  };

  handleSetMusicType = musicType => {
    this.setState({ musicType });
  };

  setClipField = (fieldName, value) => {
    this.setState(prevState => ({
      clipData: {
        ...prevState.clipData,
        [fieldName]: value,
      },
    }));
  };

  setEditData = (key, value) => {
    this.setState(prevState => ({
      editData: {
        ...prevState.editData,
        [key]: value,
      },
    }));
  };

  renderCongrates = () => {
    const { clipData, videoInfo } = this.state;
    const {
      clips,
      nid,
      clip_title: clipTitle,
      descriptive_title: predefinedTitle,
      clip_production: clipProduction,
      artist,
      artist_id: artistId,
      show,
      show_id: showId,
      field_year: fieldYear,
      field_month: fieldMonth,
      field_day: fieldDay,
      artist_new: isNewArtist,
      show_new: isShowNew,
    } = clipData;
    const date = getDateFromEntity({ fieldYear, fieldMonth, fieldDay }, true);
    const thumbnail = get(videoInfo, 'thumbnail', 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png');
    return (
      <div className="form-wrapper ">
        <p className="text-muted lead mb-1">Thank you, your clip(s) were saved successfully.</p>
        <p className="text-muted lead mb-4">The following content was created:</p>
        {isNewArtist && (
          <p className="text-muted lead mb-2">
            A new artist with the name:
            {artist}
          </p>
        )}
        {isShowNew && (
          <p className="text-muted lead mb-2">
            A new show with the name:
            {show}
          </p>
        )}
        <React.Fragment>
          <div className="uploaded-file-box">
            <Row className="mb-4">
              <Col md={12} className="d-flex ">
                <div className="uploaded-file-video mr-2">
                  <a className="text-muted" href={getConcatenatedURI('video', nid, artist, show, clipTitle)}>
                    <ImageBox src={thumbnail} />
                  </a>
                </div>
                <div className="uploaded-file-text ml-4">
                  <a className="text-muted" href={getConcatenatedURI('video', nid, artist, show, clipTitle)}>
                    <h5 className="text-white">{decodeHtmlSpecialChars(clipTitle)}</h5>
                  </a>
                  <a className="text-muted" href={getConcatenatedURI('artists', artistId, artist)}>
                    <h5>{decodeHtmlSpecialChars(artist)}</h5>
                  </a>
                  <a className="text-muted" href={getConcatenatedURI('shows', showId, show)}>
                    <p>{decodeHtmlSpecialChars(show)}</p>
                  </a>
                  <a className="text-muted" href={`/browse/calendar/${fieldYear}${fieldMonth}${fieldDay}`}>
                    <p>{date}</p>
                  </a>
                </div>
              </Col>
            </Row>
            {clips
              && clips.map(item => {
                const {
                  nid,
                  clip_title: clipTitle,
                  descriptive_title: predefinedTitle,
                  clip_production: clipProduction,
                  artist,
                  artist_id: artistId,
                  show,
                  show_id: showId,
                  field_year: fieldYear,
                  field_month: fieldMonth,
                  field_day: fieldDay,
                  artist_new: isNewArtist,
                  show_new: isShowNew,
                } = item;
                const date = getDateFromEntity({ fieldYear, fieldMonth, fieldDay }, true);
                const dateUrl = getDateFromEntity({ fieldYear, fieldMonth, fieldDay });
                const thumbnail = get(videoInfo, 'thumbnail', 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png');
                return (
                  <Row className="mb-4">
                    <Col md={12} className="d-flex ">
                      <div className="uploaded-file-video mr-2">
                        <a className="text-muted" href={getConcatenatedURI('video', nid, artist, show, clipTitle)}>
                          <ImageBox src={thumbnail} />
                        </a>
                      </div>
                      <div className="uploaded-file-text ml-4">
                        <a className="text-muted" href={getConcatenatedURI('video', nid, artist, show, clipTitle)}>
                          <h5 className="text-white">{decodeHtmlSpecialChars(clipTitle)}</h5>
                        </a>
                        <a className="text-muted" href={getConcatenatedURI('artists', artistId, artist)}>
                          <h5>{decodeHtmlSpecialChars(artist)}</h5>
                        </a>
                        <a className="text-muted" href={getConcatenatedURI('shows', showId, show)}>
                          <p>{decodeHtmlSpecialChars(show)}</p>
                        </a>
                        <a className="text-muted" href={`/browse/calendar?date=${dateUrl}`}>
                          <p>{date}</p>
                        </a>
                      </div>
                    </Col>
                  </Row>
                );
              })}
          </div>
        </React.Fragment>
        <p className="mt-4">
          Would you like to
          {' '}
          <span onClick={this.start} className="add-another">
            add another
          </span>
          {' '}
          clip?
        </p>
      </div>
    );
  };

  renderCongratesMultiClip = () => {
    const { clipData, videoInfo } = this.state;
    const {
      clips,
      artist,
      artist_id: artistId,
      show,
      show_id: showId,
      field_year: fieldYear,
      field_month: fieldMonth,
      field_day: fieldDay,
      artist_new: isNewArtist,
      show_new: isShowNew,
    } = clipData;
    const date = getDateFromEntity({ fieldYear, fieldMonth, fieldDay }, true);
    const dateUrl = getDateFromEntity({ fieldYear, fieldMonth, fieldDay });
    const thumbnail = get(videoInfo, 'thumbnail', 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png');
    return (
      <div className="form-wrapper ">
        <p className="text-muted lead mb-4">
          Thank you, your clip was saved successfully. The following content was created:
        </p>
        {isNewArtist && (
        <p className="text-muted lead mb-2">
A new artist with the name:
          {` ${artist}`}
        </p>
)}
        {isShowNew && (
        <p className="text-muted lead mb-2">
A new show with the name:
          {` ${show}`}
        </p>
)}
        <p className="text-muted lead mb-4">
The following
          {` ${clips.length}`}
          {' '}
clip(s):
        </p>
        <React.Fragment>
          <div className="uploaded-file-box">
            {clips.map(item => {
              const { nid, clip_title: clipTitle } = item;

              return (
                <Row className="mb-4">
                  <Col md={12} className="d-flex ">
                    <div className="uploaded-file-video mr-2">
                      <a className="text-muted" href={getConcatenatedURI('video', nid, artist, show, clipTitle)}>
                        <ImageBox src={thumbnail} />
                      </a>
                    </div>
                    <div className="uploaded-file-text ml-4">
                      <a className="text-muted" href={getConcatenatedURI('video', nid, artist, show, clipTitle)}>
                        <h5 className="text-white">{decodeHtmlSpecialChars(clipTitle)}</h5>
                      </a>
                      <a className="text-muted" href={getConcatenatedURI('artists', artistId, artist)}>
                        <h5>{decodeHtmlSpecialChars(artist)}</h5>
                      </a>
                      <a className="text-muted" href={getConcatenatedURI('shows', showId, show)}>
                        <p>{decodeHtmlSpecialChars(show)}</p>
                      </a>
                      <a className="text-muted" href={`/browse/calendar?date=${dateUrl}`}>
                        <p>{date}</p>
                      </a>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </div>
          <p>
            Would you like to
            {' '}
            <span onClick={this.start} className="add-another">
              add another
            </span>
            {' '}
            clip?
          </p>
        </React.Fragment>
      </div>
    );
  };

  refreshURL = () => {
    this.setState({ videoURL: '' });
  };

  render() {
    const { step, formId, videoURL, videoInfo, musicType, clipData, editData } = this.state;
    const isSingle = clipData.single_multi && clipData.single_multi === 'single';
    const { loading } = this.state;

    return (
      <App pageClass="add-clip-page">
        <section className="section window-section">
          <div className="container">
            <div className="window-section-box">

              {loading ? (
                <PageContentLoader />
            ) : (
              <>
                <StepBar active={step} />
                {formId === '1A' && (
                <EmbedCode
                  videoURL={videoURL}
                  onResult={this.setVideoInfo}
                  onChangeURL={this.handleChangeURL}
                  refreshURL={this.refreshURL}
                  onNext={this.goToForm}
                />
              )}
                {formId === '1B' && (
                <Found
                  videoURL={videoURL}
                  onChangeURL={this.handleChangeURL}
                  refreshURL={this.refreshURL}
                  onResult={this.setVideoInfo}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  onStartOver={this.start}
                />
              )}
                {formId === '2A' && (
                <SelectType
                  videoInfo={videoInfo}
                  clipType={clipData.clip_type}
                  clipProduction={clipData.clip_production}
                  setMusicType={this.handleSetMusicType}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                />
              )}
                {formId === '2B' && (
                <SongType
                  videoInfo={videoInfo}
                  songType={clipData.single_multi}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                />
              )}
                {formId === '2C' && (
                <CheckInfo
                  videoInfo={videoInfo}
                  hasInfo={editData.hasInfo}
                  setEditData={this.setEditData}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                />
              )}
                {formId === '2D' && (
                <SetTotal
                  videoInfo={videoInfo}
                  setEditData={this.setEditData}
                  total={editData.total}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                />
              )}
                {formId === '2E' && (
                <MultiSongName
                  videoInfo={videoInfo}
                  clipTitle={clipData.clip_title}
                  descriptiveTitle={clipData.descriptive_title}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                />
              )}
                {formId === '2F' && (
                <SingleSongName
                  videoInfo={videoInfo}
                  clipTitle={clipData.clip_title}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  type={musicType}
                />
              )}
                {formId === '2G' && (
                <SingleSongSequence
                  videoInfo={videoInfo}
                  setClipField={this.setClipField}
                  sequence={clipData.sequence}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                />
              )}
                {formId === '3A' && (
                <DateInput
                  videoInfo={videoInfo}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  fieldYear={clipData.field_year}
                  fieldMonth={clipData.field_month}
                  fieldDay={clipData.field_day}
                />
              )}
                {formId === '3B' && (
                <Artist
                  videoInfo={videoInfo}
                  artist={clipData.artist}
                  artistId={clipData.artist_id}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  type={musicType}
                  singleMulti={clipData.single_multi}
                />
              )}
                {formId === '3C' && musicType === 'Music' && (
                <CanonicalRecording
                  videoInfo={videoInfo}
                  artist={clipData.artist_id}
                  canonicalRecording={clipData.canonical_recording}
                  canonicalRecordingLabel={clipData.canonical_recording_label}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                />
              )}
                {formId === '3D' && (
                <SingleSongName
                  videoInfo={videoInfo}
                  clipTitle={clipData.clip_title}
                  setClipField={this.setClipField}
                  type={musicType}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                />
              )}
                {formId === '3E' && (
                <Show
                  videoInfo={videoInfo}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  show={clipData.show}
                  season={clipData.season}
                  episode={clipData.episode}
                />
              )}
                {formId === '3F' && (
                <Tags
                  videoInfo={videoInfo}
                  setClipField={this.setClipField}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  clipTags={clipData.clip_tags || []}
                />
              )}
                {formId === '4A' && (
                <Review
                  total={editData.total}
                  clipData={clipData}
                  videoUrl={videoURL}
                  videoInfo={videoInfo}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  setClipField={this.setClipField}
                />
              )}
                {formId === '4B' && !isSingle && (
                <EditClips
                  total={editData.total} // editData.total
                  videoInfo={videoInfo}
                  clipData={clipData}
                  parentClip={clipData.entityId} // clipData.entityId
                  videoURL={videoURL}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  setClipField={this.setClipField}
                />
              )}
                {formId === '4C' && (
                <EditSequence
                  total={editData.total} // editData.total
                  videoInfo={videoInfo}
                  clipData={clipData}
                  parentClip={clipData.entityId} // clipData.entityId
                  videoURL={videoURL}
                  onNext={this.goToForm}
                  onBack={this.goToBack}
                  setClipField={this.setClipField}
                />
              )}
                {formId === '4B' && isSingle && this.renderCongrates()}
                {formId === '5A' && !isSingle && this.renderCongratesMultiClip()}
                {formId === '5A' && isSingle && this.renderCongrates()}
              </>
            )}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

AddClip.propTypes = {
  url: PropTypes.object.isRequired,
};

export default AddClip;
