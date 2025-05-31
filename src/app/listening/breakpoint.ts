// breakpoint
export namespace BP {
    export const add = (list: number[], time_ms: number) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i] > time_ms) {
                if (i === 0) {
                    return [time_ms, ...list]
                }
                return list.slice(0, i).concat(time_ms, ...list.slice(i))
            }
        }
        return list.concat(time_ms)
    }
}