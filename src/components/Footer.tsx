import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        background: '#85a312',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        boxShadow: '0 -4px 6px rgba(0,0,0,0.8)',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem'}}>
        <div style={{ fontSize: 14 }}>{t('footer.text')}</div>
        <hr style={{ border: 'none', height: '14px', width: '1px', backgroundColor: 'white', margin: '0px' }} />
        <div style={{ fontSize: 14 }}>{t('footer.year')}</div>
        <hr style={{ border: 'none', height: '14px', width: '1px', backgroundColor: 'white', margin: '0px' }} />
        <div style={{ fontSize: 14 }}>{t('footer.author')}</div>
      </div>

    </footer>
  );
};

export default Footer;
