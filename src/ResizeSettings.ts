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

	constructor(private containerEl: HTMLElement, private plugin: MyPlugin) {
		this.resizeSettings = [];
	}

	create(): void {
		this.containerEl.createEl("h3", { text: "창 크기 조절 설정" });

		new Setting(this.containerEl)
			.setName("창 크기 조절 활성화")
			.setDesc("포커스 상태에 따라 창 크기와 위치 변경")
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
		new Setting(this.containerEl)
			.setName("현재 창 크기 포커스 상태로 저장하기")
			.addButton((button) =>
				button
					.setButtonText("포커스 상태로 저장")
					.onClick(() => this.rememberCurrentSize("focus"))
			);

		this.createBoundsSetting("포커스 시 창 위치 - x", "focusBounds.x");
		this.createBoundsSetting("포커스 시 창 위치 - y", "focusBounds.y");
		this.createBoundsSetting("포커스 시 창 크기 - w", "focusBounds.width");
		this.createBoundsSetting("포커스 시 창 크기 - h", "focusBounds.height");

		new Setting(this.containerEl)
			.setName("현재 창 크기 블러 상태로 저장하기")
			.addButton((button) =>
				button
					.setButtonText("블러 상태로 저장")
					.onClick(() => this.rememberCurrentSize("blur"))
			);

		this.createBoundsSetting("블러 시 창 위치 - x", "blurBounds.x");
		this.createBoundsSetting("블러 시 창 위치 - y", "blurBounds.y");
		this.createBoundsSetting("블러 시 창 크기 - w", "blurBounds.width");
		this.createBoundsSetting("블러 시 창 크기 - h", "blurBounds.height");
	}

	private createBoundsSetting(name: string, key: string): void {
		const setting = new Setting(this.containerEl)
			.setName(name)
			.addText((text) =>
				text
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
		return this.plugin.settings[type as "focusBounds" | "blurBounds"][property as keyof WindowBounds];
	}

	private setBoundsValue(key: string, value: number): void {
		const [type, property] = key.split(".");
		this.plugin.settings[type as "focusBounds" | "blurBounds"][property as keyof WindowBounds] = value;
	}

	private async rememberCurrentSize(state: "focus" | "blur"): Promise<void> {
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
			`현재 창 상태가 ${
				state === "focus" ? "포커스" : "블러"
			} 상태로 저장되었습니다`
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
			"포커스 시 창 위치 - x": "focusBounds.x",
			"포커스 시 창 위치 - y": "focusBounds.y",
			"포커스 시 창 크기 - w": "focusBounds.width",
			"포커스 시 창 크기 - h": "focusBounds.height",
			"블러 시 창 위치 - x": "blurBounds.x",
			"블러 시 창 위치 - y": "blurBounds.y",
			"블러 시 창 크기 - w": "blurBounds.width",
			"블러 시 창 크기 - h": "blurBounds.height",
		};
		return keyMap[name] || null;
	}

	toggle(show: boolean): void {
		this.resizeSettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
	}
}
