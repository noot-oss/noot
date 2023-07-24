export const choices: {
  handlerId: string;
  callBack: () => void;
}[] = [];

export class Choice {
  handlerId: string;
  callBack: () => void;

  constructor(handlerId = "", callBack = () => {}) {
    this.handlerId = handlerId;
    this.callBack = callBack;

    choices.push({
      handlerId: this.handlerId,
      callBack: this.callBack,
    });
  }
}
