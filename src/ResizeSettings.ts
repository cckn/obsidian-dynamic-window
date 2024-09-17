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
		const { containerEl } = this;
		containerEl.createEl("h3", { text: "Window resize settings" });

		new Setting(containerEl)
			.setName("Enable window resize")
			.setDesc("Adjust window size and position based on focus state")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableWindowResize)
					.onChange(async (value) => {
						this.plugin.settings.enableWindowResize = value;
						await this.plugin.saveSettings();
					})
			);

		this.createResizeSettings();
	}

	private createResizeSettings(): void {
		this.createBoundsGroup("Focused", "focusBounds");

		this.createBoundsGroup("Unfocused", "blurBounds");
	}

	private createBoundsGroup(
		state: "Focused" | "Unfocused",
		boundsType: string
	): void {
		const groupEl = this.containerEl.createDiv();
		groupEl.createEl("h4", { text: `${state} state settings` });

		// Focused state settings
		new Setting(groupEl)
			.setName(`Save current size as ${state} state`)
			.addButton((button) =>
				button
					.setButtonText(`Save as ${state}`)
					.onClick(() => this.saveCurrentSize(state))
			);

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

	private async saveCurrentSize(
		state: "Focused" | "Unfocused"
	): Promise<void> {
		const electron = require("electron");
		const window = electron.remote
			? electron.remote.getCurrentWindow()
			: electron.getCurrentWindow();
		const bounds = window.getBounds();

		if (state === "Focused") {
			this.plugin.settings.focusBounds = bounds;
		} else {
			this.plugin.settings.blurBounds = bounds;
		}

		await this.plugin.saveSettings();
		this.updateResizeSettings();
		new Notice(`Current window size saved as ${state} state`);
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
}
