class QA {
  #question;
  #answer;
  #model;
  #timeAsked;

  constructor(question, answer, model) {
    this.#question = question;
    this.#answer = answer;
    this.#model = model;
    this.#timeAsked = new Date().toISOString();
  }

  setQuestion(question) {
    this.#question = question;
  }

  getQuestion() {
    return this.#question;
  }

  setAnswer(answer) {
    this.#answer = answer;
  }

  getAnswer() {
    return this.#answer;
  }

  setModel(model) {
    this.#model = model;
  }

  getModel() {
    return this.#model;
  }

  setTimeAsked(timeAsked) {
    this.#timeAsked = timeAsked;
  }

  getTimeAsked() {
    return this.#timeAsked;
  }
}

model.exports = QA;
