class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.stack = "";
  }
}

export default ApplicationError;
