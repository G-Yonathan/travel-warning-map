import { useTranslation, Trans } from 'react-i18next';
import "./About.css"

export default function MapChart() {
    const { t, i18n } = useTranslation();

    return (
        <div className="about-container" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
            <div className="about-content">
                <h2>
                    {i18n.language === 'he' ? (
                        <>
                            <span className="highlight">{'אזהרות'}</span>
                            {'מסע'}
                        </>
                    ) : (
                        <>
                            {'Azharot'}
                            <span className="highlight">{'Masah'}</span>
                        </>
                    )}
                </h2>
                <p>
                    {t('about.description')}
                </p>
                <p>
                    <strong>{t('about.disclaimer_label')}</strong> <Trans i18nKey="about.disclaimer_text" components={{ 1: <strong />, 2: <a href="https://www.gov.il/en/departments/dynamiccollectors/travel-warnings-nsc?skip=0" target="blank" rel="noopener noreferrer" /> }} />
                </p>
                <hr className="soft-hr" />
                <p>
                    {t('sidebar.footer.created_by')} <a href="https://github.com/G-Yonathan" target="_blank" rel="noopener noreferrer">G-Yonathan</a>
                </p>
            </div>
        </div>
    )
}
