import { openOrCloseExtension } from '@/scripts/content'

export const AppMessagesListener = (
  message: Record<string, unknown>,
  _sender: chrome.runtime.MessageSender, // currently unused. rename to `sender` to use
  response: (response?: unknown) => void,
): void => {
  if (message.action === 'open-or-close-extension') {
    openOrCloseExtension()
    response()
  }
}
