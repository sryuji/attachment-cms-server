export const ContentHistoryAction = {
  innerHTML: 'innerHTML',
  remove: 'remove', // el.parentNode.removeChild(el)
  insertBefore: 'insertBefore', // insertAdjacentHTML('beforebegin')
  insertChildAfterBegin: 'insertChildAfterBegin', // insertAdjacentHTML('afterbegin')
  insertChildBeforeEnd: 'insertChildBeforeEnd', // insertAdjacentHTML('beforeend')
  insertAfter: 'insertAfter', // insertAdjacentHTML('afterend')
} as const
export type ContentHistoryActionType = typeof ContentHistoryAction[keyof typeof ContentHistoryAction]
