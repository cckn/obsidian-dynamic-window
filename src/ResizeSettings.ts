import { Notice, Setting } from "obsidian";
import MyPlugin from "../main";

interface WindowBounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

export class ResizeSettings {
	private resizeSettings: Setting[];
	private saveAsFocusedButton: Setting;
	private saveAsUnfocusedButton: Setting;

	constructor(private containerEl: HTMLElement, private plugin: MyPlugin) {
		this.resizeSettings = [];
	}

	create(): void {
		this.containerEl.createEl("h3", { text: "Window resize settings" });

		new Setting(this.containerEl)
			.setName("Enable window resize")
			.setDesc("Adjust window size and position based on focus state")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableWindowResize)
					.onChange(async (value) => {
						this.plugin.settings.enableWindowResize = value;
						await this.plugin.saveSettings();
						this.toggle(value);
					})
			);

		this.createResizeSettings();

		this.toggle(this.plugin.settings.enableWindowResize);
	}

	private createResizeSettings(): void {
		// Focused state settings
		this.saveAsFocusedButton = new Setting(this.containerEl)
			.setName("Save current size as focused state")
			.addButton((button) =>
				button
					.setButtonText("Save as Focused")
					.onClick(() => this.saveCurrentSize("focus"))
			);

		this.createBoundsGroup("Focused", "focusBounds");

		// Unfocused state settings
		this.saveAsUnfocusedButton = new Setting(this.containerEl)
			.setName("Save current size as unfocused state")
			.addButton((button) =>
				button
					.setButtonText("Save as Unfocused")
					.onClick(() => this.saveCurrentSize("blur"))
			);

		this.createBoundsGroup("Unfocused", "blurBounds");
	}

	private createBoundsGroup(state: string, boundsType: string): void {
		const groupEl = this.containerEl.createDiv();
		groupEl.createEl("h4", { text: `${state} state settings` });

		this.createBoundsSetting(
			groupEl,
			`${state} window X position`,
			`${boundsType}.x`
		);
		this.createBoundsSetting(
			groupEl,
			`${state} window Y position`,
			`${boundsType}.y`
		);
		this.createBoundsSetting(
			groupEl,
			`${state} window width`,
			`${boundsType}.width`
		);
		this.createBoundsSetting(
			groupEl,
			`${state} window height`,
			`${boundsType}.height`
		);
	}

	private createBoundsSetting(
		containerEl: HTMLElement,
		name: string,
		key: string
	): void {
		const setting = new Setting(containerEl).setName(name).addText((text) =>
			text
				.setPlaceholder("Enter a number")
				.setValue(this.getBoundsValue(key).toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num)) {
						this.setBoundsValue(key, num);
						await this.plugin.saveSettings();
					}
				})
		);

		this.resizeSettings.push(setting);
	}

	private getBoundsValue(key: string): number {
		const [type, property] = key.split(".");
		return this.plugin.settings[type as "focusBounds" | "blurBounds"][
			property as keyof WindowBounds
		];
	}

	private setBoundsValue(key: string, value: number): void {
		const [type, property] = key.split(".");
		this.plugin.settings[type as "focusBounds" | "blurBounds"][
			property as keyof WindowBounds
		] = value;
	}

	private async saveCurrentSize(state: "focus" | "blur"): Promise<void> {
		const electron = require("electron");
		const window = electron.remote
			? electron.remote.getCurrentWindow()
			: electron.getCurrentWindow();
		const bounds = window.getBounds();

		if (state === "focus") {
			this.plugin.settings.focusBounds = bounds;
		} else {
			this.plugin.settings.blurBounds = bounds;
		}

		await this.plugin.saveSettings();
		this.updateResizeSettings();
		new Notice(
			`Current window size saved as ${
				state === "focus" ? "focused" : "unfocused"
			} state`
		);
	}

	private updateResizeSettings(): void {
		this.resizeSettings.forEach((setting) => {
			const input = setting.settingEl.querySelector("input");
			const name = setting.nameEl.textContent || "";
			const key = this.getSettingKey(name);
			if (input && key) {
				input.value = this.getBoundsValue(key).toString();
			}
		});
	}

	private getSettingKey(name: string): string | null {
		const keyMap: { [key: string]: string } = {
			"Focused window X position": "focusBounds.x",
			"Focused window Y position": "focusBounds.y",
			"Focused window width": "focusBounds.width",
			"Focused window height": "focusBounds.height",
			"Unfocused window X position": "blurBounds.x",
			"Unfocused window Y position": "blurBounds.y",
			"Unfocused window width": "blurBounds.width",
			"Unfocused window height": "blurBounds.height",
		};
		return keyMap[name] || null;
	}

	toggle(show: boolean): void {
		this.resizeSettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
		this.saveAsFocusedButton.settingEl.style.display = show
			? "block"
			: "none";
		this.saveAsUnfocusedButton.settingEl.style.display = show
			? "block"
			: "none";
		this.containerEl.style.display = show ? "block" : "none";
	}
}
