import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

// const whitelist_url = 'https://gist.githubusercontent.com/donaldknoller/b437e471bac880dfd48cbd3ded39ada6/raw/4c1b52b65ed34b041c81a0edf79092937b06f758/whitelist-tiers.json'
const whitelist_url = 'https://gist.githubusercontent.com/donaldknoller/b437e471bac880dfd48cbd3ded39ada6/raw/14b94cda0e3ff1769ca49748529569e4c7829945/whitelist-tiers.json'
// Update the interface to be a dictionary of (address -> { tier: string })
type WhitelistData = {
  [address: string]: {
    tier: string;
  }
};

function App() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [whitelistData, setWhitelistData] = useState<WhitelistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(whitelist_url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: WhitelistData) => {
        setWhitelistData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading whitelist:', error);
        setError('Failed to load whitelist data');
        setIsLoading(false);
      });
  }, []); // Empty dependency array means this runs once when component mounts

  const isValid = (name: string): boolean => {
    if (!whitelistData) return false;
    // Case-insensitive key match in the dictionary
    return Object.keys(whitelistData).some(
      address => address.toLowerCase() === name.toLowerCase()
    );
  };

  // Helper to get tier for the address
  const getTier = (name: string): string => {
    if (!whitelistData) return '';
    const foundKey = Object.keys(whitelistData).find(
      address => address.toLowerCase() === name.toLowerCase()
    );
    return foundKey ? whitelistData[foundKey].tier : '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSubmitted(false);
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#0D0D0D] overflow-hidden">
        <div className="absolute inset-0 grid-bg"></div>
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="text-white">Loading whitelist data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-[#0D0D0D] overflow-hidden">
        <div className="absolute inset-0 grid-bg"></div>
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] overflow-hidden">
      <div className="absolute inset-0 grid-bg"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="backdrop-blur-sm bg-black/30 rounded-lg p-8 border border-white/10">
              <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">Whitelist Checker</h1>
              <p className="text-white/60 text-center mb-6 text-sm">Check your address for whitelist eligibility</p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                    Enter your address
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                    placeholder="Enter your address..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2A9D8F] text-white py-2 px-4 rounded-md hover:bg-[#238377] transition-colors duration-200"
                >
                  Check Address
                </button>
              </div>
            </form>
          ) : (
            <div className="backdrop-blur-sm bg-black/30 rounded-lg p-8 border border-white/10 text-center">
              {isValid(name) ? (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#2A9D8F] mx-auto" />
                  <h2 className="text-2xl font-bold text-[#2A9D8F]">Valid Address!</h2>
                  <p className="text-white/60">
                    "{name}" is a valid address in tier {getTier(name)}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-red-500">Invalid Address!</h2>
                  <p className="text-white/60">"{name}" is not eligible for whitelist.</p>
                </div>
              )}
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 bg-white/5 text-white py-2 px-4 rounded-md hover:bg-white/10 transition-colors duration-200 border border-white/10"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
