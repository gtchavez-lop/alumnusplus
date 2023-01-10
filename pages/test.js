import { useState } from "react";

const TestPage = () => {
  const [userInput, setUserInput] = useState({
    width: 100,
    height: 100,
    color: "#ffffff",
  });

  const [tempOutput, setTempOuput] = useState({
    width: 100,
    height: 100,
    color: "#ffffff",
  });

  return (
    <div>
      {/* rectangle */}
      <div className="fixed inset-0 w-full h-screen flex justify-center items-center">
        <div
          style={{
            width: `${tempOutput.width}px`,
            height: `${tempOutput.height}px`,
            backgroundColor: `${tempOutput.color}`,
          }}
        />
      </div>

      {/* input */}
      <div className="fixed left-10 bottom-10 bg-slate-900 w-64 p-5 flex flex-col gap-2 rounded-lg opacity-25 hover:opacity-100 transition-all duration-100">
        <label>
          <span>Height</span>
          <input
            onChange={(e) =>
              setUserInput({ ...userInput, height: e.target.value })
            }
            value={userInput.height}
            type="number"
            className="input input-primary w-full"
          />
        </label>
        <label>
          <span>Width</span>
          <input
            onChange={(e) =>
              setUserInput({ ...userInput, width: e.target.value })
            }
            value={userInput.width}
            type="number"
            className="input input-primary w-full"
          />
        </label>
        <label>
          <span>Color</span>
          <input
            onChange={(e) =>
              setUserInput({ ...userInput, color: e.target.value })
            }
            value={userInput.color}
            type="color"
            className="input input-primary w-full"
          />
        </label>

        <button
          onClick={(e) => {
            setTempOuput(userInput);
          }}
          className="btn btn-primary w-full"
        >
          Change Style
        </button>
      </div>
    </div>
  );
};

export default TestPage;
