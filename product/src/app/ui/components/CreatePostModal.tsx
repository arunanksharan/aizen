import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { XSquare } from 'react-feather';

const CreatePostModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isVisible, onClose, children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!isVisible || !loaded) return null;
  // if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="modal-content w-4/5 h-4/5 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-end items-center w-full mb-2">
          <XSquare size={24} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
export default CreatePostModal;
