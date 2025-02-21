export const getScreenWeight = () => {
  return window.innerWidth
}

export const isPhone = () => {
  return getScreenWeight() < 1024
}
