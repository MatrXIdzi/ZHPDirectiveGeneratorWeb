import { useEffect } from 'react';
import './i18n/i18n';
import { useTranslation } from 'react-i18next';

import AppRouter from './routes/AppRouter';

function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t('meta.title');
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  return (
    <>
      <div>
        <AppRouter />
      </div>
    </>
  );
}

export default App;
