import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {

  // =========================
  // STATES
  // =========================

  const [darkMode, setDarkMode] = useState(true);

  const [topic, setTopic] = useState("");

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("report");

  const [history, setHistory] = useState(() => {

    const savedHistory = localStorage.getItem(
      "researchHistory"
    );

    return savedHistory
      ? JSON.parse(savedHistory)
      : [];

  });

  const [steps, setSteps] = useState([
    {
      name: "Search Agent",
      status: "pending",
    },
    {
      name: "Reader Agent",
      status: "pending",
    },
    {
      name: "Writer Agent",
      status: "pending",
    },
    {
      name: "Critic Agent",
      status: "pending",
    },
  ]);

  // =========================
  // LOCAL STORAGE
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "researchHistory",
      JSON.stringify(history)
    );

  }, [history]);

  // =========================
  // THEME VARIABLES
  // =========================

  const cardBg = darkMode
    ? "bg-[#1e293b]"
    : "bg-white";

  const innerBg = darkMode
    ? "bg-[#0f172a]"
    : "bg-gray-200";

  const textSecondary = darkMode
    ? "text-gray-400"
    : "text-gray-700";

  // =========================
  // STEP UPDATER
  // =========================

  const updateStep = (index, status) => {

    setSteps((prev) => {

      const updated = [...prev];

      updated[index].status = status;

      return updated;
    });
  };

  // =========================
  // DELETE HISTORY ITEM
  // =========================

  const deleteHistoryItem = (indexToDelete) => {

    setHistory((prev) =>
      prev.filter(
        (_, index) => index !== indexToDelete
      )
    );
  };

  // =========================
  // CLEAR HISTORY
  // =========================

  const clearHistory = () => {

    setHistory([]);

    localStorage.removeItem(
      "researchHistory"
    );
  };

  // =========================
  // PDF EXPORT
  // =========================

 

  // =========================
  // HANDLE RESEARCH
  // =========================

  const handleResearch = async () => {

    if (!topic.trim()) return;

    setLoading(true);

    setData(null);

    setSteps([
      { name: "Search Agent", status: "working" },
      { name: "Reader Agent", status: "pending" },
      { name: "Writer Agent", status: "pending" },
      { name: "Critic Agent", status: "pending" },
    ]);

    setTimeout(() => {
      updateStep(0, "done");
      updateStep(1, "working");
    }, 2000);

    setTimeout(() => {
      updateStep(1, "done");
      updateStep(2, "working");
    }, 5000);

    setTimeout(() => {
      updateStep(2, "done");
      updateStep(3, "working");
    }, 8000);

    try {

      const response = await axios.post(
        "https://multi-agent-research-backend.onrender.com/research",
        {
          topic,
        }
      );

      setData(response.data);

      setHistory((prev) => [

        {
          topic,
          result: response.data,
          timestamp: new Date().toLocaleString(),
        },

        ...prev,

      ]);

      setSteps([
        { name: "Search Agent", status: "done" },
        { name: "Reader Agent", status: "done" },
        { name: "Writer Agent", status: "done" },
        { name: "Critic Agent", status: "done" },
      ]);

    } catch (error) {

      console.error(error);

      alert("Research failed.");

    }

    setLoading(false);
  };

  // =========================
  // TAB CONTENT
  // =========================

  const renderContent = () => {

    if (!data) return "";

    switch (activeTab) {

      case "search":
        return data.search_results;

      case "scrape":
        return data.scraped_content;

      case "report":
        return data.report;

      case "critic":
        return data.feedback;

      default:
        return "";
    }
  };

  // =========================
  // UI
  // =========================

  return (

    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        darkMode
          ? "bg-[#0f172a] text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-3">
            Multi-Agent AI Research System
          </h1>

          <p className={`${textSecondary} text-lg`}>
            Powered by LangChain + Mistral AI
          </p>

          <div className="flex gap-4 mt-5">

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

           

          </div>

        </div>

        {/* INPUT SECTION */}

        <div className={`${cardBg} p-6 rounded-2xl shadow-lg mb-8`}>

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Enter research topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`flex-1 p-4 rounded-xl border outline-none ${
                darkMode
                  ? "bg-[#0f172a] border-gray-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />

            <button
              onClick={handleResearch}
              className="bg-blue-600 hover:bg-blue-700 transition px-8 rounded-xl font-semibold text-white"
            >
              Research
            </button>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT PANEL */}

          <div className={`${cardBg} rounded-2xl p-6 shadow-lg`}>

            <h2 className="text-2xl font-bold mb-6">
              Agent Workflow
            </h2>

            <div className="space-y-5">

              {steps.map((step, index) => (

                <AgentStep
                  key={index}
                  name={step.name}
                  status={step.status}
                  innerBg={innerBg}
                  darkMode={darkMode}
                />

              ))}

            </div>

            {/* HISTORY */}

            <div className="mt-10">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-bold">
                  Research History
                </h2>

                {history.length > 0 && (

                  <button
                    onClick={clearHistory}
                    className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white transition"
                  >
                    Clear All
                  </button>

                )}

              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">

                {history.length === 0 ? (

                  <p className="text-gray-400 text-sm">
                    No research history yet.
                  </p>

                ) : (

                  history.map((item, index) => (

                    <div
                      key={index}
                      className={`${innerBg} p-4 rounded-xl`}
                    >

                      <div
                        onClick={() => setData(item.result)}
                        className="cursor-pointer hover:opacity-80 transition"
                      >

                        <p className="font-semibold mb-1">
                          {item.topic}
                        </p>

                        <p className="text-xs text-gray-400">
                          {item.timestamp}
                        </p>

                      </div>

                      <button
                        onClick={(e) => {

                          e.stopPropagation();

                          deleteHistoryItem(index);

                        }}
                        className="mt-3 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white transition"
                      >
                        Delete
                      </button>

                    </div>

                  ))

                )}

              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}

          <div className={`lg:col-span-3 ${cardBg} rounded-2xl p-6 shadow-lg`}>

            {/* TABS */}

            <div className="flex flex-wrap gap-3 mb-6">

              <TabButton
                label="Search Results"
                value="search"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                innerBg={innerBg}
              />

              <TabButton
                label="Scraped Content"
                value="scrape"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                innerBg={innerBg}
              />

              <TabButton
                label="Final Report"
                value="report"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                innerBg={innerBg}
              />

              <TabButton
                label="Critic Review"
                value="critic"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                innerBg={innerBg}
              />

            </div>

            {/* CONTENT */}

            <div className={`${innerBg} rounded-xl p-6 h-[700px] overflow-y-auto`}>

              {loading && !data ? (

                <div className="flex flex-col items-center justify-center h-full">

                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>

                  <p className="text-xl text-gray-300">
                    Agents are researching...
                  </p>

                </div>

              ) : data ? (

                <div className="prose prose-invert max-w-none">

                  <ReactMarkdown>
                    {renderContent()}
                  </ReactMarkdown>

                </div>

              ) : (

                <div className="flex items-center justify-center h-full text-gray-500 text-xl">

                  Enter a topic to begin research

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

/* =========================
   AGENT STEP
========================= */

function AgentStep({
  name,
  status,
  innerBg,
  darkMode
}) {

  let color = "bg-gray-500";
  let text = "Pending";

  if (status === "working") {
    color = "bg-yellow-500";
    text = "Working";
  }

  if (status === "done") {
    color = "bg-green-500";
    text = "Completed";
  }

  return (

    <div className={`flex items-center justify-between ${innerBg} p-4 rounded-xl`}>

      <div className="flex items-center gap-3">

        <div className={`w-3 h-3 rounded-full ${color}`}></div>

        <p className="font-medium">
          {name}
        </p>

      </div>

      <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
        {text}
      </span>

    </div>

  );
}

/* =========================
   TAB BUTTON
========================= */

function TabButton({
  label,
  value,
  activeTab,
  setActiveTab,
  innerBg,
}) {

  return (

    <button
      onClick={() => setActiveTab(value)}
      className={`px-5 py-2 rounded-xl transition ${
        activeTab === value
          ? "bg-blue-600 text-white"
          : `${innerBg} hover:bg-[#334155]`
      }`}
    >
      {label}
    </button>

  );
}

export default App;