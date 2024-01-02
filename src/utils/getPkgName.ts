export function getPkgName(name: string) {
  return name.replace(/^@[^/]+\//, "");
}
