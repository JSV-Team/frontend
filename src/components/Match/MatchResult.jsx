// MatchResult - Display when a match is found
function MatchResult({ match, onStartChat }) {
  if (!match) return null;

  return (
    <div className="match-result">
      <h2>It's a Match! 🎉</h2>
      <p>You and {match.name} liked each other!</p>
      <button onClick={onStartChat}>Start Chat</button>
    </div>
  );
}

export default MatchResult;