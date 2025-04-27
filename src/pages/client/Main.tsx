import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type UserResponse = {
  firstname: string;
  surname: string;
  email: string;
  username: string;
};

const Main = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError(t('main.noToken'));
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || 'Fetch error');
        }

        const userData = await response.json();
        console.log('USER DATA:', userData);
        setUser(userData);
      } catch (err) {
        setError(`${t('main.fetchError')}: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    fetchUser();
  }, [t]);

  return (
    <div>
      <h1>{t('main.title')}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user ? (
        <div>
          <p>
            {t('main.hello')}, <strong>{user.firstname} {user.surname}</strong>!
          </p>
          <p>{t('main.username')}: {user.username}</p>
          <p>{t('main.email')}: {user.email}</p>
        </div>
      ) : !error ? (
        <p>{t('main.loading')}</p>
      ) : null}
    </div>
  );
};

export default Main;
