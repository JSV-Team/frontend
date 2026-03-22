// MatchCard - Display a user profile in the matching queue
function MatchCard({ profile, onLike, onPass }) {
  return (
    <div className="match-card">
      <h3>{profile.name || 'Unknown'}</h3>
      <p>{profile.bio || 'No bio available'}</p>
      <div className="match-card-actions">
        <button onClick={() => onPass(profile.id)}>Pass</button>
        <button onClick={() => onLike(profile.id)}>Like</button>
      </div>
    </div>
  );
}

export default MatchCard;