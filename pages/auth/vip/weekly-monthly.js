import Link from "next/link";
import { useRouter } from "next/router";

function WeeklyMonthly() {
    const router = useRouter();
    const { plan } = router.query;

    return (
        <div className="container">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-3 border-bottom">
                <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item vipPages"><a href="/auth/dashboard">Home</a></li>
                    <li className="bi bi-chevron-compact-right vipPages"><a href="/auth/plan">Tips Store</a></li>
                    <li className="bi bi-chevron-compact-right active" aria-current="page">Pages</li>
                </ol>
                <div className="col-md-12 text-center">
                    <h3 className="font-weight-bold text-dark">{plan == "weekly" ? "Weekly" : "Monthly"} Prediction Plans</h3>
                </div>
            </nav>

            {/* Multibet Plans */}
            <h3 className="font-weight-bold text-color-dark mb-3">Multibet Plans</h3>
            <div className="row mb-4">
                <div className="col-md-3 col-6 mb-2">
                    <Link href="/auth/vip/premium_multibets" className="btn btn-primary w-100">View (3 - 5.0) Odds</Link>
                </div>
                <div className="col-md-3 col-6 mb-2">
                    <Link href="/auth/vip/10-Odds" className="btn btn-primary w-100">View 10 Odds</Link>
                </div>
            </div>

            {/* Jackpot Plans */}
            <h4 className="mt-4">Jackpot Plans</h4>
            <div className="row mb-4">
                <div className="col-md-3 col-6 mb-2">
                    <Link href="/auth/vip/premium-jackpot-predictions?jackpot_name=Sportpesa Mega Jackpot" className="btn btn-success w-100">Sportpesa Mega Jackpot</Link>
                </div>
                <div className="col-md-3 col-6 mb-2">
                    <Link href="/auth/vip/premium-jackpot-predictions?jackpot_name=Sportpesa Midweek Jackpot" className="btn btn-success w-100">Sportpesa Midweek Jackpot</Link>
                </div>
                <div className="col-md-3 col-6 mb-2">
                    <Link href="/auth/vip/premium-jackpot-predictions?jackpot_name=Betika Midweek Jackpot" className="btn btn-success w-100">Betika Midweek Jackpot</Link>
                </div>
                <div className="col-md-3 col-6 mb-2">
                    <Link href="/auth/vip/premium-jackpot-predictions?jackpot_name=Shabiki Midweek Jackpot" className="btn btn-success w-100">Shabiki Midweek Jackpot</Link>
                </div>
            </div>
        </div>
    );
}

export default WeeklyMonthly;
