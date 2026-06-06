import { Adsense } from '@/components/shared/client-adsense';
import React from 'react';

function ContactUs(){
    return (
    <div className="sites-card">
        <div className="m-2" style={{color:"black", fontSize: "17px"}}>
            <p>For assistance, inquiries, or any feedback regarding our site, please feel free to contact us using the following information:</p>
            <p><b>Email:</b> &nbsp;<a style={{color:"blue",fontWeight:"bold"}} href="mailto:support@pitchpredictions.com">support@pitchpredictions.com</a></p>
            <p><b>Tel:</b> &nbsp;<b style={{color:"blue"}}>+254 799 566 287</b></p>
            <p>We welcome your feedback, ideas, and suggestions. Don't hesitate to reach out to us.</p><br/>
            <h4 className="sectionTitle text-center"><b>Pitchpredictions.com - Your Trusted Source for Football Insights.</b></h4>
        </div>
        <br/>
        <Adsense
            client="ca-pub-5665711413000284"
            slot="7856848919"
            style={{ display: "block" }}
            layout="display"
            format="auto"
        /> 
    </div>
    )
}

export default  ContactUs;