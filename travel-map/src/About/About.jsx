import "./About.css"

export default function MapChart() {
    return (
        <div className="about-container">
            <div className="about-content">
                <h2>About Azharot<span className="highlight">Masah</span></h2>
                <p>
                    This application provides a visual map interface to view Israeli government travel warnings.
                </p>
                <p>
                    <strong>Disclaimer:</strong> This tool is <strong>not</strong> an official source for government travel warnings. Rely exclusively on the <a href="https://www.gov.il/en/departments/dynamiccollectors/travel-warnings-nsc?skip=0" target="blank" rel="noopener noreferrer">official source</a> before making travel plans.
                </p>
                <hr className="soft-hr" />
                <p>
                    Created by <a href="https://github.com/G-Yonathan" target="_blank" rel="noopener noreferrer">G-Yonathan</a>
                </p>
            </div>
        </div>
    )
}
