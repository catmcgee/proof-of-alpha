import React, { useState, useEffect } from 'react';

export default function RandomPage() {
  const hardcodedKey = "B62qizDkmrBBFjPUmgBzRHrVMGWKZQqAEWuuofVYY7FeDcwAYqn8E11";
  const [verificationKey, setVerificationKey] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setVerificationKey(hardcodedKey);
  }, []);

  const handleKeyChange = e => {
    setVerificationKey(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationKey !== hardcodedKey) {
      setError("Invalid verification key.");
    } else {
      setError(null);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-6 max-w-sm mx-auto bg-gray-800 rounded-xl shadow-md flex items-center space-x-4">
        <div className="flex-shrink-0">
          <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
            <label className="mb-2 text-lg font-medium text-gray-200" htmlFor="verificationKey">Verification Key</label>
            <input className="px-3 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none" type="text" id="verificationKey" value={verificationKey} onChange={handleKeyChange} />
            <button className="px-4 py-2 mt-5 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700" type="submit">Submit</button>
            {error &&
              <div className="text-xs text-red-500 mt-2">
                {error}
              </div>
            }
          </form>
          
          {isSubmitted && !error && (
            <div className="text-lg text-green-500 mt-5">
              ZK proof verified, see <a href = "https://berkeley.minaexplorer.com/wallet/B62qjC91sRWBqABxgX84RSz55hSUuwgzyLpN4JxRWEegHHkhaCbVMni">chain</a>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
