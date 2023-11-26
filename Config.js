class Config {
    #port;
    #db_file;
    #max_len_name;
    static #instance;

    constructor(port, db_file, max_len_name) {
        if (Config.#instance) {
            return Config.#instance;
        }

        this.#port = port;
        this.#db_file = db_file;
        this.#max_len_name = max_len_name;
        Config.#instance = this;
    }

    getPort() {
        return this.#port;
    }

    getDbFile() {
        return this.#db_file;
    }

    getMaxLenName() {
        return this.#max_len_name;
    } 
}

module.exports = Config;