import { Rect } from "../Rect.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { InputTerminal } from "./InputTerminal.js";
import { OutputTerminal } from "./OutputTerminal.js";
import { NodeSetting } from "./NodeSetting.js";
import { AssetStore } from "../AssetStore.js";
import { GuiAssets } from "./GuiAssets.js";

export type enqueueNodeForUpdateCallback = (node: Node) => void;

export type NodePrototype = {
  TYPE: string;
  VALUES: object[];
  X: number;
  Y: number;
}

export type NodeSettingPrototype = {
  SETTING: string;
  VALUE: any;
}

export class Node {
  public rect: Rect = new Rect(0,0,220,100);
  public inputs: InputTerminal[] = [];
  public outputs: OutputTerminal[] = [];
  public settings: NodeSetting[] = [];
  public name: string;
  public type: string;

  public serialization_id: number = 0;

  public AddOutput(name: string, type: string) : OutputTerminal {
    let r = new OutputTerminal(name, type, this, this.outputs.length);
    this.outputs.push(r);
    return r;
  }

  public AddInput(name: string, type: string) : InputTerminal {
    let r = new InputTerminal(name, type, this, this.inputs.length);
    this.inputs.push(r);
    return r;
  }

  public AddSetting(name: string, type: string, value: any, assetStore: AssetStore) : NodeSetting {
    let r = new NodeSetting(name, type, this, this.settings.length, value, assetStore);
    this.settings.push(r);
    return r;
  }

  public findOutput(name: string) : OutputTerminal | undefined {
    return this.outputs.find(o => o.name == name);
  }

  public findInput(name: string) : InputTerminal | undefined {
    return this.inputs.find(i => i.name == name);
  }

  public findSetting(name: string) : NodeSetting | undefined {
    return this.settings.find(s => s.name == name);
  }

  public serialize() : object {
    return {
      TYPE: this.type,
      VALUES: this.settings.map(s => { return { SETTING: s.name, VALUE: s.serialize() }; }),
      X: this.rect.x,
      Y: this.rect.y
    }
  }

  public deserialize(prototype: NodePrototype) : void {
    prototype.VALUES.forEach(s => {
      let settingPrototype = s as NodeSettingPrototype;
      let setting = this.findSetting(settingPrototype.SETTING);
      if (setting) setting.deserialize(settingPrototype.VALUE);
    });
    this.rect.x = prototype.X;
    this.rect.y = prototype.Y;
  }

  public updateHeight() : void {
    let inputHeight = this.inputs.reduce((accumulator, currentValue) => accumulator + currentValue.getDimensions().y + 4, 0);
    let settingsHeight = this.settings.reduce((accumulator, currentValue) => accumulator + currentValue.getDimensions().y + 4, 0);
    this.rect.height = 30 + Math.max(30 * this.outputs.length, inputHeight) + settingsHeight;
  }

  public checkInputs(callback: enqueueNodeForUpdateCallback): boolean {
    let success = true;
    this.inputs.forEach(input => {
      if (input.required == false)
        return;
      
      let v = input.getValue();
      if (v == null) { 
        success = false;
        input.error = true;
        let previousNode = input.getSourceNode();
        if (previousNode != undefined) 
          callback(previousNode);
      } 
      else {
        input.error = false;
      }
    });
    return success;
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {

  }

  public positionInputs() : void {
    let yOffset = 30;
    for (let input = 0; input < this.inputs.length; ++input) {
      let inputDimensions = this.inputs[input].getDimensions();
      this.inputs[input].setDrawArea(new Rect(this.rect.x + 4, this.rect.y + yOffset, inputDimensions.x, inputDimensions.y));
      yOffset += inputDimensions.y + 4;
    }
  }

  public positionOutputs() : void {
    let yOffset = 30;
    for (let output = 0; output < this.outputs.length; ++output) {
      let outputDimensions = this.outputs[output].getDimensions();
      this.outputs[output].setDrawArea(new Rect(this.rect.x + this.rect.width - outputDimensions.x - 2, this.rect.y + yOffset, outputDimensions.x, outputDimensions.y));
      yOffset += outputDimensions.y + 4;
    }
  }

  public positionSettings() : void {
    let yOffset = 30 + (30 * Math.max(this.inputs.length, this.outputs.length));
    for (let setting = 0; setting < this.settings.length; ++setting) {
      let settingDimensions = this.settings[setting].getDimensions();
      this.settings[setting].setDrawArea(new Rect(this.rect.x + 4, this.rect.y + yOffset, settingDimensions.x, settingDimensions.y));
      yOffset += settingDimensions.y + 4;
    }
  }

  public draw(ctx: RenderTarget2D, editor: EditorContext, nodeSet: NodeSet, guiAssets: GuiAssets, callback: enqueueNodeForUpdateCallback) {
    ctx.drawCustom(context => {
      context.beginPath();
      context.roundRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height, 10);
      context.fillStyle = "#000000";
      context.fill();
      context.strokeStyle = "#f0f0f0";
      context.stroke();
      context.closePath();
    });
    ctx.drawString(this.name, this.rect.origin.add(new Point(8, 4)), "#ffffff");

    this.positionInputs();
    for (let input = 0; input < this.inputs.length; ++input) {
      this.inputs[input].draw(ctx, editor, nodeSet, guiAssets);
    }

    this.positionOutputs();
    for (let output = 0; output < this.outputs.length; ++output) 
      this.outputs[output].draw(ctx, editor, nodeSet);

    this.positionSettings();
    for (let setting = 0; setting < this.settings.length; ++setting)
      this.settings[setting].draw(ctx, editor, nodeSet);

    editor.widget(new Rect(this.rect.x + 4, this.rect.y + 4, this.rect.width - 8 - 24, 20), {fill: "", border: ""}).ifDragged(handle => {
      this.rect.x += handle.mouseDelta.x;
      this.rect.y += handle.mouseDelta.y;
    });

    editor.widget(new Rect(this.rect.x + this.rect.width - 24, this.rect.y + 2, 22, 22), { image: guiAssets.refreshIcon }).ifMouseDown(button => {
      callback(this);
      button.handled = true;
    });
  }

  constructor(type: string, name: string, assetStore: AssetStore) {
    this.type = type;
    this.name = name;
  }
}