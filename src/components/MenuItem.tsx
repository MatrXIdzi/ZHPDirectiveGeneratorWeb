import { Link } from 'react-router-dom';

interface MenuItemProps {
  to?: string;
  label: React.ReactNode;
  onClick?: () => void;
}

const MenuItem = ({ to, label, onClick }: MenuItemProps) => {
  if (to) {
    return (
      <Link
        to={to}
        style={{
          display: 'block',
          padding: '0.5rem 1rem',
          color: 'white',
          textDecoration: 'none',
          background: 'none',

        }}
        onClick={onClick}
      >
        {label}
      </Link>
    );
  }
  return (
    <button
      style={{
        padding: '0.5rem 1rem',
        color: 'white',
        width: '100%',
        background: 'none',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
  
};

export default MenuItem;


