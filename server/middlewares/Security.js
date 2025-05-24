import helmet from "helmet";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
import express from "express"; 

const limiter = rateLimit({  // anti brute force
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par ip
  message: "Trop de requêtes, réessayez plus tard.",
});

export default function applySecurityMiddleware(app) {
  app.use(helmet());                // rend safe les headers http
  app.use(xssClean());                           // nettoie xss
  app.use(express.json());                 // Parse json body
  app.use(express.urlencoded({ extended: true })); // Parse form data
  app.use(limiter);                             
}

// pas bsoin de protection csrf car on utilise pas de cookies