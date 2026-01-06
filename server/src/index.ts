import express from "express";
import cors from "cors";

require('dotenv').config()
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var globalCounter = 0;

// In dev, your React app runs on http://localhost:5173
// This allows direct cross-origin calls if you choose to do them.
// (If you use Vite proxy, CORS won't even be necessary, but it's harmless.)
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.get("/api/hello", (_req, res) => {
  res.json({
    message: "Hello from Node + Express + TypeScript!",
    time: new Date().toISOString(),
  });
});

app.get("/api/getClients", async (_req, res) => {
  try{
    if (globalCounter < 15) {
      const resp = await fetch(process.env.REACT_APP_Base_URL + `/clients?offset=${_req.query.page}`, { method: "GET", headers: {"Authorization": `Bearer ${process.env.REACT_APP_API_Key}`}})
      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
      }
      res.send(await resp.json());
    }
    else{
      res.status(429).send("too many messages");
    }
  }
  finally{
    globalCounter++
    setTimeout(() => globalCounter--, 60000);
  }
});

app.get("/api/getProjects", async (_req, res) => {
  try{
    if (globalCounter < 15) {
      const resp = await fetch(process.env.REACT_APP_Base_URL + `/clients/${_req.query.id}/projects`, { method: "GET", headers: {"Authorization": `Bearer ${process.env.REACT_APP_API_Key}`}})
      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
      }
      res.send(await resp.json());
    }
    else{
      res.status(429).send("too many messages");
    }
  }
  finally{
    globalCounter++
    setTimeout(() => globalCounter--, 60000);
  }
});

app.get("/api/getTasks", async (_req, res) => {
  try{
    if (globalCounter < 15) {
      const resp = await fetch(process.env.REACT_APP_Base_URL + `/projects/${_req.query.id}/tasks`, { method: "GET", headers: {"Authorization": `Bearer ${process.env.REACT_APP_API_Key}`}})
      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
      }
      res.send(await resp.json());
    }
    else{
      res.status(429).send("too many messages");
    }
  }
  finally{
    globalCounter++
    setTimeout(() => globalCounter--, 60000);
  }
});

app.get("/api/getTimeEntries", async (_req, res) => {
  try{
    if (globalCounter < 15) {
      const resp = await fetch(process.env.REACT_APP_Base_URL + `/time-entries?offset=${_req.query.page}`, { method: "GET", headers: {"Authorization": `Bearer ${process.env.REACT_APP_API_Key}`}})
      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
      }
      res.send(await resp.json());
    }
    else{
      res.status(429).send("too many messages");
    }
  }
  finally{
    globalCounter++
    setTimeout(() => globalCounter--, 60000);
  }
});

app.post("/api/createTimeEntries", async (_req, res) => {
  try{
    if (globalCounter < 15) {
      const resp = await fetch(process.env.REACT_APP_Base_URL + `/time-entries`, { method: "POST", body: JSON.stringify({..._req.body, taskId: parseInt(_req.body.taskId), userId: process.env.REACT_APP_API_Key}), headers: {"Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_API_Key}`}})
      if (!resp.ok) {
        console.log(await resp.json());
        throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
      }
      res.send(await resp.json());
    }
    else{
      res.status(429).send("too many messages");
    }
  }
  finally{
    globalCounter++
    setTimeout(() => globalCounter--, 60000);
  }
});

app.post("/api/updateTimeEntries", async (_req, res) => {
  try{
    if (globalCounter < 15) {
      const resp = await fetch(process.env.REACT_APP_Base_URL + `/time-entries/${_req.query.id}`, { method: "PUT", body: JSON.stringify({..._req.body, taskId: parseInt(_req.body.taskId), userId: process.env.REACT_APP_API_Key}), headers: {"Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_API_Key}`}})
      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
      }
      res.send(await resp.json());
    }
    else{
      res.status(429).send("too many messages");
    }
  }
  finally{
    globalCounter++
    setTimeout(() => globalCounter--, 60000);
  }
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
