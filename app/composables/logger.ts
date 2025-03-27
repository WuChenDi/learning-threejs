/* eslint-disable no-console */

export function useLogger() {
  const { public: { NUXT_LOG_ENABLE } } = useRuntimeConfig()

  function getTimestamp() {
    return `${new Date().toLocaleString()}.${new Date().getMilliseconds()}`
  }

  function log(message?: any, ...optionalParams: any[]) {
    if (NUXT_LOG_ENABLE === 'true')
      console.log(`[${getTimestamp()}]`, message, ...optionalParams)
  }

  function info(message?: any, ...optionalParams: any[]) {
    if (NUXT_LOG_ENABLE === 'true')
      console.info(`[${getTimestamp()}]`, message, ...optionalParams)
  }

  function warn(message?: any, ...optionalParams: any[]) {
    console.warn(`[${getTimestamp()}]`, message, ...optionalParams)
  }

  function error(message?: any, ...optionalParams: any[]) {
    console.error(`[${getTimestamp()}]`, message, ...optionalParams)
  }

  return {
    log,
    info,
    warn,
    error,
  }
}
