import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import "./PersonalData.css"

type Unit = {
    region: string;
    district: string;
    group: string;
    troop: string;
  };

type UserResponse = {
    firstname: string;
    surname: string;
    email: string;
    username: string;
    rank: string;
    function: string;
    unit: Unit | null;
  };

const PersonalData = () => {
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
            setUser(userData);
        } catch (err) {
            setError(`${t('main.fetchError')}: ${err instanceof Error ? err.message : String(err)}`);
        }
        };

    fetchUser();
  }, [t]);


  return (
    <div className="personal-data-container">
        <div className="personal-data-data">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/user.svg" height={300}/>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <div>{t('personal-data.firstname')}: {user?.firstname}</div>
                      <div>{t('personal-data.surname')}: {user?.surname}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>{t('personal-data.email')}: {user?.email}</div>
                        <div>{t('personal-data.rank')}: {user?.rank}</div>
                    </div>
                    
                </div>
                

            </div>
            <p></p>
            
            <p></p>
            <p>{t('personal-data.username')}: {user?.username}</p>
            <p>{t('personal-data.rank')}: {user?.rank}</p>
            <p>{t('personal-data.function')}: {user?.function}</p>
            <p>{t('personal-data.unit')}:</p>
            <div style={{ marginLeft: '20px' }}>
                <p>{user?.unit?.district}</p>
                <p>{user?.unit?.region}</p>
                <p>{user?.unit?.group}</p>
                <p>{user?.unit?.troop}</p>
            </div>
            <hr 
                style={{
                    border: 'none',
                    height: '1px',
                    backgroundColor: 'white',
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 0,
                    marginBottom: 0,
                }}
            />
        </div>
    </div>
  );
}

export default PersonalData;