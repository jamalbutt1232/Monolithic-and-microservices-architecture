const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
  "/users",
  createProxyMiddleware({
    target: `http://localhost:${process.env.USER_SERVICE_PORT}`,
    changeOrigin: true,
  })
);
app.use(
  "/todos",
  createProxyMiddleware({
    target: `http://localhost:${process.env.TODO_SERVICE_PORT}`,
    changeOrigin: true,
  })
);

const PORT = process.env.API_GATEWAY_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
