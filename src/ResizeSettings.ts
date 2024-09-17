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
		const createSetting = (
			name: string,
			desc: string,
			focusKey: string,
			blurKey: string
		) => {
			const setting = new Setting(this.containerEl)
				.setName(name)
				.setDesc(desc);

			setting.addText((text) =>
				text
					.setPlaceholder("포커스 시")
					.setValue(
						(
							this.plugin.settings.focusBounds[
								focusKey.split(".")[1] as keyof WindowBounds
							] as number
						).toString()
					)
					.onChange(async (value) => {
						const num = parseInt(value);
						if (!isNaN(num)) {
							this.plugin.settings.focusBounds[
								focusKey.split(".")[1] as keyof WindowBounds
							] = num;
							await this.plugin.saveSettings();
						}
					})
			);

			setting.addText((text) =>
				text
					.setPlaceholder("블러 시")
					.setValue(
						this.plugin.settings.blurBounds[
							blurKey.split(".")[1] as keyof WindowBounds
						].toString()
					)
					.onChange(async (value) => {
						const num = parseInt(value);
						this.plugin.settings.blurBounds[
							blurKey.split(".")[1] as keyof WindowBounds
						] = num;
						await this.plugin.saveSettings();
					})
			);

			this.resizeSettings.push(setting);
		};

		createSetting("X 위치", "창의 X 좌표", "focusBounds.x", "blurBounds.x");
		createSetting("Y 위치", "창의 Y 좌표", "focusBounds.y", "blurBounds.y");
		createSetting(
			"너비",
			"창의 너비",
			"focusBounds.width",
			"blurBounds.width"
		);
		createSetting(
			"높이",
			"창의 높이",
			"focusBounds.height",
			"blurBounds.height"
		);

		new Setting(this.containerEl)
			.setName("현재 창 크기 기억")
			.addButton((button) =>
				button
					.setButtonText("포커스 상태로 저장")
					.onClick(() => this.rememberCurrentSize("focus"))
			)
			.addButton((button) =>
				button
					.setButtonText("블러 상태로 저장")
					.onClick(() => this.rememberCurrentSize("blur"))
			);
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
			const inputs = setting.settingEl.querySelectorAll("input");
			const name = setting.nameEl.textContent || "";
			const [focusKey, blurKey] = this.getSettingKeys(name);
			inputs[0].value =
				this.plugin.settings.focusBounds[
					focusKey.split(".")[1] as keyof WindowBounds
				].toString();
			inputs[1].value =
				this.plugin.settings.blurBounds[
					blurKey.split(".")[1] as keyof WindowBounds
				].toString();
		});
	}

	private getSettingKeys(name: string): [string, string] {
		switch (name) {
			case "X 위치":
				return ["focusBounds.x", "blurBounds.x"];
			case "Y 위치":
				return ["focusBounds.y", "blurBounds.y"];
			case "너비":
				return ["focusBounds.width", "blurBounds.width"];
			case "높이":
				return ["focusBounds.height", "blurBounds.height"];
			default:
				return ["", ""];
		}
	}

	toggle(show: boolean): void {
		this.resizeSettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
	}
}
