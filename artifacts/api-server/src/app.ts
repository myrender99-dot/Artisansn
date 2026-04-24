import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import fs from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

function resolveStaticDir(): string | null {
  const envDir = process.env["STATIC_DIR"];
  const candidates = [
    envDir,
    path.resolve(process.cwd(), "../artisan-sn/dist/public"),
    path.resolve(process.cwd(), "artifacts/artisan-sn/dist/public"),
    "/opt/render/project/src/artifacts/artisan-sn/dist/public",
    "/app/artifacts/artisan-sn/dist/public",
  ].filter((p): p is string => Boolean(p));

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "index.html"))) {
      return dir;
    }
  }
  return null;
}

const staticDir = resolveStaticDir();
if (staticDir) {
  logger.info({ staticDir }, "Serving static frontend");
  app.use(express.static(staticDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
} else {
  logger.warn(
    { cwd: process.cwd(), envStaticDir: process.env["STATIC_DIR"] },
    "Static frontend directory not found; only API routes will be served",
  );
}

export default app;
