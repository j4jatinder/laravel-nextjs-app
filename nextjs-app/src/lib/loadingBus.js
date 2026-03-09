const loadingSubscribers = new Set()

let loadingCount = 0

const notify = () => {
    loadingSubscribers.forEach(subscriber => subscriber(loadingCount))
}

export const startLoading = () => {
    loadingCount += 1
    notify()
}

export const stopLoading = () => {
    loadingCount = Math.max(0, loadingCount - 1)
    notify()
}

export const subscribeLoading = callback => {
    loadingSubscribers.add(callback)
    callback(loadingCount)

    return () => {
        loadingSubscribers.delete(callback)
    }
}
