import { Component, componentType} from "./Component.js";

type HealthComponentPrototype = {
  maxHealth: number;
}

@componentType("Health")
export class HealthComponent extends Component {
  public maxHealth: number;
  public currentHealth: number;

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as HealthComponentPrototype;
    this.maxHealth = p?.maxHealth ?? 1;
    this.currentHealth = this.maxHealth;
  }
}