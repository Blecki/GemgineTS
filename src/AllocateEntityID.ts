let nextEntityID = 1;

export function allocateEntityID() {
  return nextEntityID++;
}