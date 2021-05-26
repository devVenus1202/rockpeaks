import React from 'react';
import PropTypes from 'prop-types';

import './TagItem.style.scss';

function TagItem(props) {
  const { value, onRemoveItem } = props;
  const removeItem = item => {
    onRemoveItem(item);
  };

  return (
    <div className="tag-item-container alert alert-light alert-dismissible fade show custom-alert" role="alert">
      {onRemoveItem && (
        <button className="close text-light" onClick={() => removeItem(value)} type="button" data-dismiss="alert">
          <span aria-hidden="true">×</span>
        </button>
      )}
      {value}
    </div>
  );
}

TagItem.propTypes = {
  value: PropTypes.string.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

export default TagItem;
