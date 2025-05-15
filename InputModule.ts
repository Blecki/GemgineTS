import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";


export class RenderModule extends Module {

  ComponentCreated(component: Component) {}

  Update() {
  }

  Render(context: RenderingContext) {}
}