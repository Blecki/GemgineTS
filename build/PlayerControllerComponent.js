import { Component } from "./Component.js";
import { Input } from "./Input.js";
export class PlayerControllerComponent extends Component {
    input;
    initialize(engine, template) {
        this.input = new Input();
        this.input.bind("KeyA", "west");
        this.input.bind("KeyW", "north");
        this.input.bind("KeyS", "south");
        this.input.bind("KeyD", "east");
        this.input.initialize();
    }
    update() {
        if (this.input.check("west"))
            this.parent.localPosition.x -= 1;
        if (this.input.check("north"))
            this.parent.localPosition.y -= 1;
        if (this.input.check("south"))
            this.parent.localPosition.y += 1;
        if (this.input.check("east"))
            this.parent.localPosition.x += 1;
        this.input.cleanup();
    }
}
//# sourceMappingURL=PlayerControllerComponent.js.map