"use client";
import { motion } from "framer-motion";

const CardFlip = ({ frontImage, isRevealed, frontContent }) => {
  const cardBackImage = "/cardImages/redback.png"; // Path to the back of the card image

  return (
    <motion.div
      className="w-auto h-auto cursor-pointer transition-transform duration-400 relative" // Card dimensions and animation
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isRevealed ? 360 : 0 }} // Flip when the card is revealed
      style={{ marginLeft: isRevealed ? "0" : "-30px", zIndex: isRevealed ? 1 : 0 }} // Overlap by 50%
    >
      {isRevealed ? (
        <div className="w-18 h-24 flex items-center justify-center bg-white rounded-lg">
          <img
            src={frontImage} // Show front image if revealed
            alt={`Card Front`}
            className="w-full h-full object-cover rounded-lg" // Tailwind classes for image styling
          />
          <span className="absolute text-xl font-bold text-center">{frontContent}</span> {/* Display the assigned value */}
        </div>
      ) : (
        <img
          src={cardBackImage} // Show back image if not revealed
          alt={`Card Back`}
          className="w-24 h-50% object-cover rounded-lg" // Tailwind classes for image styling
        />
      )}
    </motion.div>
  );
};

export default CardFlip;
