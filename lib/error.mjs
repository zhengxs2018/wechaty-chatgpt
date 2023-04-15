export class ChatServiceError extends Error {
  /**
   *
   * @param {string} service
   * @param {string} message
   */
  constructor(service, message) {
    super(message)
    this.service = service
  }
}
