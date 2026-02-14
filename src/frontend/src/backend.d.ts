import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    completeLevel(user: Principal, level: bigint): Promise<boolean>;
    getCompletedLevelsCount(_user: Principal): Promise<bigint>;
    isBadgeMinted(_user: Principal): Promise<boolean>;
    isLevelCompleted(user: Principal, _level: bigint): Promise<boolean>;
}
