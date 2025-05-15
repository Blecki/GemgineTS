let nextEntityID = 1;

export function AllocateEntityID() {
  return nextEntityID++;
}