/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    /** Set by the middleware on /admin and /api/admin requests. */
    user?: import('./lib/auth').AdminUser;
  }
}
