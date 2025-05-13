import { Transform } from "./Transform.js";
import { Component } from "./Component.js";

export class Entity {
  public transform: Transform;
  public components: Component[] = [];
}

