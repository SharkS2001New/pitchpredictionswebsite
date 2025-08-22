import Calendar from 'react-calendar';
import {useState} from 'react';
import { useRouter } from "next/router";

function MyCalendar() {
    var router = useRouter();
    const [date, setDate] = useState(new Date());

    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 60);
  
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);

    //Get selected date in order to set it as the active date in the select filter
    const dateSelected = router.query["filter_date"];

    function onChange(nextDate) {      
      setDate(nextDate);

      const date = new Date(nextDate);
      const tzOffset = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
      const localDate = new Date(date.getTime() - tzOffset);
      const isoDate = localDate.toISOString().substring(0, 10);

      if (router.isReady) {
        // Open up filter by date page
        router.push({
          pathname: "/football-predictions-for-" + isoDate,
          query: { filter_date: isoDate }
        }).then(() => {
          window.location.reload();
        });
      } 
    }

    if(router.pathname.substring(1) === "[football-prediction-for-date]" && dateSelected != undefined){
      return (
        <div className="row">
          <Calendar value={new Date(dateSelected)}  minDate={minDate} maxDate={maxDate} onChange={onChange} />
        </div>
      );
    }else if(router.pathname.substring(1) !== "[football-prediction-for-date]") {
      return (
        <div className="row">
          <Calendar value={date}  minDate={minDate} maxDate={maxDate} onChange={onChange} />
        </div>
      );
    }
  }

  export default MyCalendar;