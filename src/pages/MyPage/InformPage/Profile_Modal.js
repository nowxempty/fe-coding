import React, { useState } from 'react';
import './Profile_Modal.css';

const Modal = ({ isOpen, onClose, onSelect, setImage }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('이미지를 업로드해주세요.');
      return;
    }
    onSelect(file);
    setImage(URL.createObjectURL(file));
    setImageUrl(null);
    setFile(null);
    onClose();
  };

  const handleClose = () => {
    setImageUrl(null);
    setFile(null);
    onClose();
  };

  return (
    isOpen && (
      <div className="Inform_modal-background" onClick={handleClose}>
        <div className="Inform_modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="lst_thumb">
            <ul>
              <li style={{ display: imageUrl ? 'block' : 'none' }}>
                <img className="Inform_profile-image" src={imageUrl} alt="업로드 된 이미지" />
              </li>
            </ul>
          </div>
          <form id="formElem" encType="multipart/form-data">
            <input
              type="file"
              className="hidden_input"
              id="reviewImageFileOpenInput"
              accept="image/*"
              onChange={handleFileChange}
            />
          </form>
          <button onClick={handleUpload}>이미지 업로드</button>
        </div>
      </div>
    )
  );
};

export default Modal;
