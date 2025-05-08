import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MenuList from '../MenuList';
import MenuItem from '../MenuItem';

const MenuBarGuest = () => {
  const { i18n, t } = useTranslation();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageMenuOpen(false);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in local storage');
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        return;
    }
    

    localStorage.removeItem('token');
    navigate('/login');

  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        background: '#555',
        boxShadow: '0 4px 6px rgba(0,0,0,0.8)',
        color: 'white',
        padding: '1rem',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
      <div style={{ width: '40px' }} />
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <img src="/logoZHPGeneratorNapis.svg" height={60} alt="Logo ZHP Generator Rozkazów"/>        
        </Link>

        {/* Ikonki po prawej */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Przycisk użytkownika + menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setUserMenuOpen(prev => !prev);
                setLanguageMenuOpen(false);
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '25%',
                overflow: 'hidden',
                border: '2px solid white',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
              }}
            >
              <img src="/menu_icon.svg" height={'100%'} alt="Menu" />
            </button>

            {userMenuOpen && (
              <MenuList>
                <MenuItem to="/personal-data" label={t('menu.personalData')} onClick={() => setUserMenuOpen(false)} />
                <MenuItem label={t('menu.logout')} onClick={() => handleLogout()}/>
              </MenuList>
            )}
          </div>

          {/* Przycisk języka + menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setLanguageMenuOpen(prev => !prev);
                setUserMenuOpen(false);
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '25%',
                overflow: 'hidden',
                border: '2px solid white',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
              }}
            >
              <img
                src={i18n.language === 'pl' ? '/pl.svg' : '/en.svg'}
                alt="language"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>

            {languageMenuOpen && (
              <MenuList>
                <MenuItem
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={'/pl.svg'} alt="language" style={{ width: 30, objectFit: 'cover' }} />
                      Polski
                    </div>
                  }
                  onClick={() => changeLanguage('pl')}
                />
                <MenuItem
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={'/en.svg'} alt="language" style={{ width: 30, objectFit: 'cover' }} />
                      English
                    </div>
                  }
                  onClick={() => changeLanguage('en')}
                />
              </MenuList>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MenuBarGuest;
