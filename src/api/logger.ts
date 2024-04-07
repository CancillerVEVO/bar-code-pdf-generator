import pino from "pino";
import pretty from "pino-pretty";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      prettyPrint: {
        colorize: true,
      },
    },
  },
});


export default logger;

