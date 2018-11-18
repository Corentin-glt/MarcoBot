

class ChatAction {
  constructor(action) {
    const AVAILABLE_TYPES = ['typing_on', 'typing_off', 'mark_seen'];

    if (AVAILABLE_TYPES.indexOf(action) < 0)
      throw new Error('Valid action is required for Facebook ChatAction template. Available actions are: typing_on, typing_off and mark_seen.');

    this.template = {
      sender_action: action
    };
  }

  get() {
    return this.template;
  }
}

module.exports = ChatAction;