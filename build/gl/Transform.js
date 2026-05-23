import { m4Identity, m4Translate, m4RotateX, m4RotateY, m4RotateZ, m4Scale, m4Multiply } from "./Matrix4x4.js";
import { Vector3Raw } from "./Vector3.js";
// Note: Ensure your Matrix4x4 has methods like identity(), multiply(), translate(), rotateX/Y/Z(), and scale()
export class Transform {
    ID;
    parent;
    children;
    localPosition = new Vector3Raw(0, 0, 0);
    localRotation = new Vector3Raw(0, 0, 0);
    localScale = new Vector3Raw(1, 1, 1);
    _localMatrix;
    _globalMatrix;
    _isDirty = true; // Tracks if matrices need recalculation
    constructor(ID, matrixInstance) {
        this.ID = ID;
        this.parent = null;
        this.children = [];
        // Assumes your Matrix4x4 class needs to be instantiated
        this._localMatrix = m4Identity();
        this._globalMatrix = m4Identity();
    }
    /**
     * Marks this transform and all of its descendants as dirty.
     * Call this whenever localPosition, localRotation, or localScale changes.
     */
    setDirty() {
        if (this._isDirty)
            return;
        this._isDirty = true;
        for (const child of this.children) {
            child.setDirty();
        }
    }
    /**
     * Returns the local transformation matrix (TRS).
     */
    get localMatrix() {
        if (this._isDirty) {
            this.updateMatrices();
        }
        return this._localMatrix;
    }
    /**
     * Returns the global (world) transformation matrix.
     */
    get globalMatrix() {
        if (this._isDirty) {
            this.updateMatrices();
        }
        return this._globalMatrix;
    }
    /**
     * Extracts the absolute global position directly from the global matrix.
     * This handles parent rotation and scale correctly, unlike simple vector addition.
     */
    get globalPosition() {
        const m = this.globalMatrix;
        // In a standard column-major 4x4 matrix, translation is in elements 12, 13, 14
        // In a row-major matrix, translation is in elements 12, 13, 14 (or indexed appropriately)
        return new Vector3Raw(m[12], m[13], m[14]);
    }
    /**
     * Recalculates the local and global matrices sequentially down the hierarchy.
     */
    updateMatrices() {
        // 1. Build Local Matrix using TRS order (Scale -> Rotate -> Translate)
        // Adjust these method names to match your Matrix4x4 implementation API
        let lm = m4Identity();
        lm = m4Translate(lm, this.localPosition.x, this.localPosition.y, this.localPosition.z);
        lm = m4RotateX(lm, this.localRotation.x);
        lm = m4RotateY(lm, this.localRotation.y);
        lm = m4RotateZ(lm, this.localRotation.z);
        this._localMatrix = m4Scale(lm, this.localScale.x, this.localScale.y, this.localScale.z);
        // 2. Build Global Matrix
        if (!this.parent) {
            this._globalMatrix = this._localMatrix;
        }
        else {
            // Global = ParentGlobal * Local
            this._globalMatrix = m4Multiply(this.parent.globalMatrix, this._localMatrix);
        }
        this._isDirty = false;
    }
    addChild(other) {
        other.parent = this;
        this.children.push(other);
        other.setDirty();
    }
}
//# sourceMappingURL=Transform.js.map