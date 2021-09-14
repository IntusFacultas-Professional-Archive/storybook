export function* idGenerator() {
  let value = 0;
  while (true) {
    value += 1;
    yield `IFCAlert-${value}`;
  }
}
export default idGenerator;
