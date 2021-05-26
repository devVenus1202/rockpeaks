import React from 'react';
import './Tag.style.scss';

const Tag = props => {
  const { value, onRemoveItem } = props;

  return (
    <>
      {value.map((item, ind) => {
        return (
          <div
            className="tag-container alert alert-light alert-dismissible fade show custom-alert"
            role="alert"
            key={ind}
          >
            <button
              className="close text-light"
              onClick={onRemoveItem(item)}
              type="button"
              data-dismiss="alert"
            >
              <span aria-hidden="true">×</span>
            </button>
            {item}
          </div>
        );
      })}
    </>
  );
};

export default Tag;
