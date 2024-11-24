export function getRoute(lock: boolean, level: string) {
  if (level === "start") {
    return lock ? "/" : "/level/one";
  } else if (level === "one") {
    return lock ? "/level/one" : "/level/two";
  }
}
