import './AllCompletedModal.css';
import { useNavigate } from 'react-router-dom';

const AllCompletedModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const ToMainRoom = () => {
      navigate('/ChallengeList');
    };

    if (!isOpen) return null;
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>모든 문제 풀이를 완료하셨습니다.</h2>
          <button onClick={ToMainRoom}>나가기</button>
        </div>
      </div>
    );
  };
  
export default AllCompletedModal;