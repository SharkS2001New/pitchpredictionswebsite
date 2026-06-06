import { useState } from 'react';
import useCompatRouter from "../functions/use-compat-router";

function CustomDatePicker() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    var router = useCompatRouter();

    //function to handle date change on select
    function handleDateChange(event) {        
        const { value } = event.target;
        const newDate = new Date(selectedDate);
        newDate.setDate(value);
        setSelectedDate(newDate);
        
        getDateRange();

        //call function to open up the routing pages
        OpenRoutingPages(newDate.toISOString().slice(0, 10));
    }

    //function to select previous date
    function selectPreviousDateOnClick() {
        const { firstDate } = getDateRange();
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        if (newDate >= firstDate) {
            setSelectedDate(newDate);
            //call function to open up the routing pages
            OpenRoutingPages(newDate.toISOString().slice(0, 10));
        }
    }
  
    //function to select next date
    function selectNextDateOnClick() {
        const { lastDate } = getDateRange();
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        if (newDate <= lastDate) {
            setSelectedDate(newDate);
            //call function to open up the routing pages
            OpenRoutingPages(newDate.toISOString().slice(0, 10));
        }
    }
    
    function getDateRange() {
        const previousDays = 6;
        const nextDays = 15;
        const today = new Date();
        const firstDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - previousDays);
        const lastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + nextDays);
        return { firstDate, lastDate };
    }

    //Get selected date in order to set it as the active date in the select filter
    const dateSelected = router.query["filter_date"];

    //function to open up the routing pages
    function OpenRoutingPages(myselectedDateValue) {
        if(router.pathname.substring(1) == "football-predictions/double-chance-predictions"){
            if(router.isReady){
                //open up filter by date page
                router.push({
                    pathname: "/football-predictions-by-date/double-chance-predictions",
                    query: {filter_date: myselectedDateValue}
                });                  
            }  
        }else if(router.pathname.substring(1) == "football-predictions/predictions-under-over-goals"){
            if(router.isReady){
                //open up filter by date page
                router.push({
                    pathname: "/football-predictions/predictions-under-over-goals",
                    query: {filter_date: myselectedDateValue}
                });
            }  
        }else{
            if (router.isReady) {
                // Open up filter by date page
                router.push({
                  pathname: "/football-predictions-for-" + myselectedDateValue,
                  query: { filter_date: myselectedDateValue }
                }).then(() => {
                  window.location.reload();
                });
            }              
        }     
    }

    if(router.pathname.substring(1) === "[football-prediction-for-date]" && dateSelected != undefined){
        return (
            <div className="row custom-select">
                <div className="col-2" onClick={() => selectPreviousDateOnClick()} style={{ fontSize: "15px", cursor: "pointer", marginTop: "3px"}}>
                    <span style={{padding: "4px 10px 3px 10px",background: "#202c3c",color: "white", borderRadius: "5px"}}>
                        <i className="bi bi-arrow-left-circle"></i>
                    </span>
                </div>                    
                <div className="col-8" style={{backgroundColor: "#202c3c", borderRadius: "5px"}}> 
                    <div style={{ position: 'relative' }}> 
                        {/* * Unicode icon for calendar */}
                        <span style={{ position: 'absolute', left: 30, fontSize: "17px" }}>&#128197;</span>
                        <select
                            id="date-select"
                            name="date"
                            className="form-control text-center custom-select-option fixturesTextSize"
                            value={new Date(dateSelected).getDate()}
                            onChange={(event) => handleDateChange(event)}
                            style={{
                                padding: "3px 10px 3px 10px",
                                background: "#202c3c",
                                color: "white",
                                border: "none",
                                fontWeight: "bold"
                            }}
                            >
                            {[...Array(getTotalDays(selectedDate))].map((_, i) => {
                                const optionDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
                                const currentDate = new Date();
                                const { firstDate, lastDate } = getDateRange();

                                if (optionDate >= firstDate && optionDate <= lastDate) {
                                return (
                                    <option
                                    key={i + 1}
                                    value={i + 1}
                                    style={
                                        optionDate.toDateString() === currentDate.toDateString()
                                        ? { fontWeight: 'bold' }
                                        : {}
                                    }
                                    >
                                    {optionDate.toDateString() === currentDate.toDateString()
                                        ? 'TODAY'
                                        : `${optionDate.getDate()}/${('0' + (optionDate.getMonth() + 1)).slice(-2)}. ${optionDate.toLocaleDateString('en-US', { weekday: 'short' })}`}
                                    </option>
                                );
                                }
                                return null;
                            })}
                        </select>
                    </div>     
                </div>
                <div className="col-2"  onClick={() => selectNextDateOnClick()} style={{fontSize: '15px', cursor: 'pointer', marginTop: "3px"}}>
                    <span style={{padding: "3px 10px 3px 10px",background: "#202c3c",color: "white", borderRadius: "5px"}}>
                        <i className="bi bi-arrow-right-circle"></i>
                    </span>
                </div>
            </div>
        );
    } else if(router.pathname.substring(1) !== "[football-prediction-for-date]"){
        return (
            <div className="row custom-select">
                <div className="col-2" onClick={() => selectPreviousDateOnClick()} style={{ fontSize: "15px", cursor: "pointer", marginTop: "3px"}}>
                    <span style={{padding: "4px 10px 3px 10px",background: "#202c3c",color: "white", borderRadius: "5px"}}>
                        <i className="bi bi-arrow-left-circle"></i>
                    </span>
                </div>                    
                <div className="col-8" style={{backgroundColor: "#202c3c", borderRadius: "5px"}}> 
                    <div style={{ position: 'relative' }}> 
                        {/* * Unicode icon for calendar */}
                        <span style={{ position: 'absolute', left: 30, fontSize: "17px" }}>&#128197;</span>
                        <select
                            id="date-select"
                            name="date"
                            className="form-control text-center custom-select-option fixturesTextSize"
                            value={selectedDate.getDate()}
                            onChange={(event) => handleDateChange(event)}
                            style={{
                                padding: "3px 10px 3px 10px",
                                background: "#202c3c",
                                color: "white",
                                border: "none",
                                fontWeight: "bold"
                            }}
                            aria-label="Select match date"
                            >
                            {[...Array(getTotalDays(selectedDate))].map((_, i) => {
                                const optionDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
                                const currentDate = new Date();
                                const { firstDate, lastDate } = getDateRange();

                                if (optionDate >= firstDate && optionDate <= lastDate) {
                                return (
                                    <option
                                    key={i + 1}
                                    value={i + 1}
                                    style={
                                        optionDate.toDateString() === currentDate.toDateString()
                                        ? { fontWeight: 'bold' }
                                        : {}
                                    }
                                    >
                                    {optionDate.toDateString() === currentDate.toDateString()
                                        ? 'TODAY'
                                        : `${optionDate.getDate()}/${('0' + (optionDate.getMonth() + 1)).slice(-2)}. ${optionDate.toLocaleDateString('en-US', { weekday: 'short' })}`}
                                    </option>
                                );
                                }
                                return null;
                            })}
                        </select>
                    </div>     
                </div>
                <div className="col-2"  onClick={() => selectNextDateOnClick()} style={{fontSize: '15px', cursor: 'pointer', marginTop: "3px"}}>
                    <span style={{padding: "3px 10px 3px 10px",background: "#202c3c",color: "white", borderRadius: "5px"}}>
                        <i className="bi bi-arrow-right-circle"></i>
                    </span>
                </div>
            </div>
        );
    }

}

export default CustomDatePicker;

//Compute number of days in the current month
function getTotalDays(selectedDate) {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const nextMonth = (currentMonth + 1) % 12; // Get the index of the next month (0-11)
  
    const currentMonthDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const nextMonthDays = new Date(currentYear, nextMonth + 1, 0).getDate();
  
    return currentMonthDays + nextMonthDays;
  }
  