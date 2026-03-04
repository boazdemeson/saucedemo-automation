const { createLogger, transports, format } = require("winston");

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.simple()
    ),
    transports: [
        new transports.File({ filename: "reports/execution.log" }),
        new transports.Console()
    ]
});

module.exports = logger;