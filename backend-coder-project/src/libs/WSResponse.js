export default class WSResponse {
    constructor(data, message, error, errorCode) {
      this.data = data;
      this.message = message || "";
      this.error = error || false;
      this.errorCode = errorCode || 0;
    }
  }