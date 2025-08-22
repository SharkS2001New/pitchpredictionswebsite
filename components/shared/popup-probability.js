import React, { useState, useEffect } from 'react';

function PopupProbabilityTooltip(props) {
  const [showModal, setShowModal] = useState(false);
  const [divPosition, setDivPosition] = useState({ left: 0, top: 0 });

  const handleDivClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setDivPosition({
      left: rect.left+30,
      top: rect.top,
    });

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowModal(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/**On Click Button being used to open the modal popup */}
      <div
        className="editable-cell"
        onClick={handleDivClick}
        style={{ cursor: 'pointer' }}>
          {props.winning_team == '1' ? props.home_odd : props.winning_team =='X' ? props.draw_odd : props.away_odd} {/**Click me to popup the modal */}
      </div>

      {showModal && (
        <div className="modal-tooltip card"   style={{
          position: 'fixed',
          left: divPosition.left,
          top: divPosition.top,
        }}>
        <div className="card-body">
          <div className="tooltip-arrow"></div>
          <div className="row mb-3">
            <div className="col-8">
              <div className="text-center">
                <span>{props.home_team_name} vs {props.away_team_name}</span>
              </div>
            </div>
            <div className="col">
              <div className="d-flex justify-content-end">
                {/**Close button */}
                <button className="btn btn-danger btn-sm close-button" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="flex-fill text-center">1</div>
            <div className="flex-fill text-center">X</div> 
            <div className="flex-fill text-center">2</div>
          </div>
          <div className="d-flex mb-1">
            <div className="flex-fill text-center" style={{border: props.winning_team == '1' ? "1px solid red" : "" }}>{props.home_odd == "" || props.home_odd == null ? " - " : props.home_odd}</div>
            <div className="flex-fill text-center" style={{border: props.winning_team == 'X' ? "1px solid red" : "" }}>{props.draw_odd == "" || props.draw_odd == null ? " - " : props.draw_odd}</div>
            <div className="flex-fill text-center" style={{border: props.winning_team == '2' ? "1px solid red" : "" }}>{props.away_odd == "" || props.away_odd == null ? " - " : props.away_odd}</div>
          </div>
        </div>
      </div>   
      )}
    </>
  );
}

export default PopupProbabilityTooltip;
