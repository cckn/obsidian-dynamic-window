import { App, PluginSettingTab } from "obsidian";
import MyPlugin from "../main";
import { BorderSettings } from "./BorderSettings";
import { OpacitySettings } from "./OpacitySettings";
import { ResizeSettings } from "./ResizeSettings";

export class SettingTab extends PluginSettingTab {
	opacitySettings: OpacitySettings;
	resizeSettings: ResizeSettings;
	borderSettings: BorderSettings;

	constructor(app: App, private plugin: MyPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const opacityDiv = containerEl.createDiv();
		const resizeDiv = containerEl.createDiv();
		const borderDiv = containerEl.createDiv();

		this.opacitySettings = new OpacitySettings(opacityDiv, this.plugin);
		this.resizeSettings = new ResizeSettings(resizeDiv, this.plugin);
		this.borderSettings = new BorderSettings(borderDiv, this.plugin);

		this.opacitySettings.create();
		this.resizeSettings.create();
		this.borderSettings.create();
	}
}
