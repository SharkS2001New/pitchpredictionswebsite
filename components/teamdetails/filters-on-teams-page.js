function FiltersTeamDetails({ activeTab, onTabChange, showStandings = true }) {
  const tabLink = (tab, label) => (
    <a
      href="#"
      className="tabs__tab"
      id={activeTab === tab ? "activeElement1" : undefined}
      onClick={(event) => {
        event.preventDefault();
        onTabChange(tab);
      }}
    >
      {label}
    </a>
  );

  return (
    <div className="tabs">
      <div className="tabs__group">
        {tabLink("results", "Results")}
        {showStandings ? tabLink("standings", "Standings") : null}
        {tabLink("upcoming", "Next Matches")}
        {tabLink("players", "Players")}
      </div>
    </div>
  );
}

export default FiltersTeamDetails;
