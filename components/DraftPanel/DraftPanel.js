import React, { Component } from 'react';
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from 'draft-js';
import dynamic from 'next/dynamic';
import draftToHtml from 'draftjs-to-html';

import './DraftPanel.style.scss';

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false });

class DraftPanel extends Component {
  constructor(props) {
    super(props);
    const { content } = props;
    if (content) {
      this.state = {
        editorState: EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(content || '<span></span>'),
          ),
        ),
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    const { content } = nextProps;
    const { editorState } = this.state;
    if (this.props.content !== content) {
      this.state = {
        editorState: EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(content || '<span></span>'),
          ),
        ),
      };
    }
  }

  onEditorStateChange = editorState => {
    const { onChangeContent, content } = this.props;

    const newContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    if (content !== newContent) {
      if (onChangeContent) onChangeContent(newContent);
    }

    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="draft-wrapper">
        <Editor
          editorState={editorState}
          wrapperClassName="draft-panel"
          editorClassName="draft-panel"
          onEditorStateChange={this.onEditorStateChange}
          stripPastedStyles
          toolbar={{
            options: ['inline', 'history'],
            // options: ['inline', 'link', 'history'],
            inline: {
              inDropdown: false,
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              options: ['bold', 'italic', 'underline'],
            },
          }}
        />
      </div>
    );
  }
}

export default DraftPanel;
