// MatchQueue - Display the queue of potential matches
function MatchQueue({ profiles, onLike, onPass, currentIndex }) {
  if (!profiles || profiles.length === 0) {
    return <div className="match-queue-empty">No profiles in queue</div>;
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="match-queue">
      {currentProfile ? (
        <div className="match-queue-current">
          <p>{profiles.length - currentIndex} profiles remaining</p>
        </div>
      ) : (
        <div className="match-queue-empty">No more profiles</div>
      )}
    </div>
  );
}

export default MatchQueue;