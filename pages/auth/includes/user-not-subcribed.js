function UserNotSubcribed(){
  return (
      <section className="section border-0 m-0 appear-animation text-center mb-5" data-appear-animation="fadeIn" data-appear-animation-delay="1200">
          <h2 align="center" style={{fontWeight: "bold"}}>PAGE RESTRICTED</h2>
          <br/>
          <p className="text-3-5 mb-0 appear-animation" style={{fontSize:"17px",fontWeight:"bold",color:"brown"}}>
            You have not subscribed to this plan or your subscription has expired !!!
          </p>
          <br />
          <div className="text-center">
            <a href="/auth/plan" className="btn btn-primary btn-sm">
              Premium Subscription
            </a>           
          </div>
      </section>
  )
}

export default UserNotSubcribed;
