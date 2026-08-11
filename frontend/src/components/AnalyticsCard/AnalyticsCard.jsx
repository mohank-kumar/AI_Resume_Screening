import "./AnalyticsCard.css";

function AnalyticsCard({ title, value, color }) {

    return (

        <div
            className="analytics-card"
            style={{
                "--card-accent": color
            }}
        >

            <div className="analytics-card-top">

                <div className="analytics-icon">
                    <span></span>
                </div>

                <span className="analytics-label">
                    {title}
                </span>

            </div>


            <div className="analytics-card-value">

                <h2>
                    {value}
                </h2>

            </div>

        </div>

    );
}

export default AnalyticsCard;