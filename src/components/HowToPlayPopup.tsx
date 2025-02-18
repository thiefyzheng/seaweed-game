import React from 'react';

interface HowToPlayPopupProps {
  onClose: () => void;
}

const HowToPlayPopup: React.FC<HowToPlayPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        <p className="mb-4">
          Welcome to Seaweed Farmer! Here&apos;s how to play:
        </p>
        <ol className="list-decimal pl-5 mb-4">
          <li>Grow seaweed by clicking the "Grow Seaweed" button.</li>
          <li>Answer quizzes to earn more seaweed.</li>
          <li>Sell your seaweed to make money.</li>
          <li>Use your money to buy upgrades and expand your farm.</li>
        </ol>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default HowToPlayPopup;
