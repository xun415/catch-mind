export const GAME_STATUS = {
    설정중: 'onSetting',
    단어선택중: 'onChoosingWord',
    게임중: 'onGame',
    종료: 'onEnd',
}

export type E_GAME_STATUS = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]