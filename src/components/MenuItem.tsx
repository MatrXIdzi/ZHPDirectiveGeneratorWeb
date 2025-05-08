import { useState } from 'react';
import { Link } from 'react-router-dom';

interface MenuItemProps {
  to?: string;
  label: React.ReactNode;
  onClick?: () => void;
}

const MenuItem = ({ to, label, onClick }: MenuItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    color: 'white',
    background: isHovered ? '#4a5814' : 'none',
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (to) {
    return (
      <Link
        to={to}
        style={{
          ...baseStyle,
          display: 'block',
          textDecoration: 'none',
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      style={{
        ...baseStyle,
        width: '100%',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
    </button>
  );
};

export default MenuItem;
