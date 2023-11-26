class Log {
    #logEntries;

    constructor() {
        this.#logEntries = [];
    }

    addEntry(time, message) {
        this.#logEntries.push({ time, message });
    }

    getEntries() {
        return this.#logEntries;
    }

    log(message) {
        const time = new Date().toISOString();
        console.log(time, message);
        this.addEntry(time, message);
    }
}

module.exports = Log;