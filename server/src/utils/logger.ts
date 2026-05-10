/**
 * Tiny structured logger. Replace with pino/winston for production scale.
 */
const ts = () => new Date().toISOString();

const fmt = (level: string, scope: string, msg: string, extra?: unknown) => {
  const base = `${ts()} [${level}] ${scope}: ${msg}`;
  return extra !== undefined ? `${base} ${JSON.stringify(extra)}` : base;
};

export const logger = {
  info: (scope: string, msg: string, extra?: unknown) =>
    console.log(fmt("INFO ", scope, msg, extra)),
  warn: (scope: string, msg: string, extra?: unknown) =>
    console.warn(fmt("WARN ", scope, msg, extra)),
  error: (scope: string, msg: string, extra?: unknown) =>
    console.error(fmt("ERROR", scope, msg, extra)),
  debug: (scope: string, msg: string, extra?: unknown) => {
    if (process.env.DEBUG) console.debug(fmt("DEBUG", scope, msg, extra));
  },
};
