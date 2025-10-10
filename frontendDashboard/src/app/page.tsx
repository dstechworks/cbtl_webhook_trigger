'use client';
import { useEffect, useState } from 'react';
import AuthGuard from './components/AuthGuard';
import Navbar from './components/Navbar';
import Alert from './components/Alert';

type Display = { displayId: string; display: string; description: string };

export default function Dashboard() {
  const [displays, setDisplays] = useState<Display[]>([]);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Alert state
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch list of displays
  useEffect(() => {
    async function load() {
      const value = localStorage.getItem('session');
      if (!value) return;
      // i want to pass value to displayLists api as query parameter
      const res = await fetch('/api/displayLists?session=' + value);
      const data = await res.json();
      setDisplays(data.displays || []);
    }
    load();
  }, []);

  // Filtered list
  const filtered = displays.filter(d =>
    d.display.toLowerCase().includes(search.toLowerCase())
  );

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim() || !selected) {
      setAlert({ message: "Please fill in both fields.", type: "error" });
      return;
    }

    const selectedDisplay = displays.find(d =>
      d.display.trim().toLowerCase() === selected.trim().toLowerCase()
    );

    if (!selectedDisplay) {
      setAlert({ message: "Please select a valid display.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://64.227.136.248:3013/triggerServerWebhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          display: selectedDisplay.display,
          displayId: selectedDisplay.displayId,
          description: selectedDisplay.description
        })
      });

      if (!response.ok) throw new Error('Network error');
      await response.text();

      setText('');
      setSelected(null);
      setSearch('');
      setAlert({ message: "Submitted Successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      setAlert({ message: "Submission failed!", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthGuard>
      <Navbar />
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="flex items-center justify-center min-h-9/10 bg-[linear-gradient(135deg,#ece9e6,#ffffff)]">
        <div className="bg-white p-12 md:p-10 sm:p-6 rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.08)] w-[95%] max-w-3xl text-center fade-in">
          <h2 className="mb-8 text-[1.75rem] font-semibold text-[#333]">
            Submit Your Information
          </h2>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Enter Text */}
            <div className="text-left relative">
              <label className="block font-medium mb-2 text-[#444]">Enter Text:</label>
              <input
                type="text"
                value={text}
                onChange={(e) => {
                  if (e.target.value.length <= 27) { // limit to 27 characters
                    setText(e.target.value);
                  }
                }}
                placeholder="Enter your text"
                className="w-full p-4 border border-gray-300 rounded-xl text-base transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {/* Optional character counter */}
              <p className="text-xs text-gray-400 mt-2">{text.length}/27 characters</p>
            </div>


            {/* Select Display */}
            <div className="text-left relative">
              <label className="block font-medium mb-2 text-[#444]">Select Display:</label>
              <input
                type="text"
                value={selected || search}
                onChange={(e) => {
                  setSelected(null);
                  setSearch(e.target.value);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search display..."
                className="w-full p-4 border border-gray-300 rounded-xl text-base transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {/* Dropdown */}
              {showDropdown && filtered.length > 0 && (
                <div className="absolute top-full left-0 w-full max-h-52 bg-white border border-gray-300 rounded-b-xl shadow-md overflow-y-auto z-50">
                  {filtered.map((d) => (
                    <div
                      key={`${d.displayId}-${d.display}`}
                      className="p-3 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelected(d.display);
                        setSearch(d.display);
                        setShowDropdown(false);
                      }}
                    >
                      {d.display}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !text.trim() || !selected}
              className="w-full py-4 text-white bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
