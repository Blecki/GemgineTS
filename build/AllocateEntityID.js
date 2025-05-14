let nextEntityID = 1;
export function AllocateEntityID() {
    let r = nextEntityID;
    nextEntityID += 1;
    return r;
}
//# sourceMappingURL=AllocateEntityID.js.map