import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function handler(req, res) {
  const ipres = await fetch("https://ipapi.co/json/", {
    // fix cors issue
    // headers: {
    //   "Content-Type": "application/json",
    //   Accept: "application/json",
    // },
  });

  // Rest of the API logic
  res.status(200).json({ ipres });
}

export default handler;
