const express = require("express");
const proxy = require("express-http-proxy");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}, Method: ${req.method}`);
  next();
});

app.use(
  "/users",
  proxy("http://localhost:3001", {
    proxyReqPathResolver: (req) => {
      return `/users${req.url}`;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      console.log(`Response from User Service: ${proxyRes.statusCode}`);
      return proxyResData;
    },
  })
);

app.use(
  "/todos",
  proxy("http://localhost:3002", {
    proxyReqPathResolver: (req) => {
      return `/todos${req.url}`;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      console.log(`Response from To-Do Service: ${proxyRes.statusCode}`);
      return proxyResData;
    },
  })
);

const PORT = process.env.API_GATEWAY_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
