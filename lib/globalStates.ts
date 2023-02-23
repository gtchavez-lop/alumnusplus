import { IAccountData, IUserHunter, IUserProvisioner } from "./types";

import { atom } from "nanostores";

export const $themeMode = atom<"dark" | "light">("dark");
export const $accountData = atom<IAccountData | null>(null);
export const $accountDetails = atom<IUserHunter | IUserProvisioner | null>(null);
export const $accountType = atom<"hunter" | "provisioner" | null>(null);
export const $registrationData = atom<IUserHunter | IUserProvisioner | null>(null);