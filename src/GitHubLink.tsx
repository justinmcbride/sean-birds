const GitHubLink = () => {
  return (
    <div className="github-link">
      <a
        href="https://github.com/justinmcbride/sean-birds"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link-anchor"
      >
        {/* Animated bubbles */}
        <div className="bubbles-container">
          {/* Bubble 1 */}
          <div className="bubble bubble-1 bubble-pink-purple"></div>
          {/* Bubble 2 */}
          <div className="bubble bubble-2 bubble-blue-cyan"></div>
          {/* Bubble 3 */}
          <div className="bubble bubble-3 bubble-yellow-orange"></div>
          {/* Bubble 4 */}
          <div className="bubble bubble-4 bubble-green-emerald"></div>
          {/* Bubble 5 */}
          <div className="bubble bubble-5 bubble-red-pink"></div>
          {/* Bubble 6 */}
          <div className="bubble bubble-6 bubble-indigo-purple"></div>
        </div>
        
        {/* GitHub Icon */}
        <img
          src="/github-mark-white.svg"
          alt="GitHub"
          width={40}
          height={40}
          className="github-icon"
        />
      </a>
    </div>
  );
};

export { GitHubLink };
