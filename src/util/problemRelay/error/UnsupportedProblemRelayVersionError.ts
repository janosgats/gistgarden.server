
export default class UnsupportedProblemRelayVersionError extends Error {
  version: string | null;

  constructor(
    version: string | null,
    message: string,
  ) {
    super(message + ` - version: ${version}`);

    this.version = version;
  }
}
