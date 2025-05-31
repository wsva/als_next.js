import { ActionResult } from "@/lib/types";

// subtile in srt format
export namespace SRT {
    /**
    15
    00:00:45,620 --> 00:00:47,480
    content, only one line
    译文
    可以有多行
     */

    /**
     * item of srt file
     */
    export class Item {
        init_status: 'success' | 'error' = 'error';
        init_error: string = 'not initialized';

        position: number = 0;
        start_time: string = '';
        end_time: string = '';
        start_ms: number = 0;
        end_ms: number = 0;
        extend_start_ms: number = 0;
        extend_end_ms: number = 0;
        content_list: string[] = [];
        translation_list: string[] = [];

        constructor(block: string[], with_translation: boolean) {
            if (block.length < 2) {
                this.init_status = 'error'
                this.init_error = `too few lines`
                return
            }
            if (!block[0].match(/^\d+$/)) {
                this.init_status = 'error'
                this.init_error = `invalid position number: ${block[0]}`
                return
            }
            const timeinfo = parse_time_line(block[1])
            if (!timeinfo) {
                this.init_status = 'error'
                this.init_error = `invalid time format: ${block[1]}`
                return
            }
            this.init_status = 'success'
            this.init_error = ''
            this.position = parseInt(block[0])
            this.start_time = timeinfo.start_time
            this.start_ms = timeinfo.start_ms
            this.end_time = timeinfo.end_time
            this.end_ms = timeinfo.end_ms
            if (with_translation) {
                if (block.length > 2) {
                    this.content_list.push(this.cleanStyle(block[2]))
                }
                if (block.length > 3) {
                    block.slice(3).forEach((v) =>
                        this.translation_list.push(this.cleanStyle(v))
                    )
                }
            } else {
                if (block.length > 2) {
                    block.slice(2).forEach((v) =>
                        this.content_list.push(this.cleanStyle(v))
                    )
                }
            }
        }

        append(item: Item) {
            this.end_time = item.end_time
            this.end_ms = item.end_ms
            this.content_list.push(...item.content_list)
            this.translation_list.push(...item.translation_list)
        }

        playMedia(media: HTMLMediaElement, extend: boolean) {
            if (!media.paused) {
                media.pause();
            }
            const start_ms = extend ? this.extend_start_ms : this.start_ms
            const end_ms = extend ? this.extend_end_ms : this.end_ms
            media.currentTime = start_ms / 1000;
            media.play();
            const timeoutId = setTimeout(() => {
                media.removeEventListener('pause', timeoutHandler)
                media.pause();
            }, end_ms - start_ms);
            media.addEventListener('pause', timeoutHandler)
            function timeoutHandler() {
                clearTimeout(timeoutId)
            }
        }

        getTip() {
            let content = this.content_list.join(' ')
            const tip = content.replaceAll(/[a-zA-Z0-9äÄöÖüÜßé]/g, '_')
            let count = 0
            let tip_with_count = ''
            for (const char of tip) {
                if (char === '_') {
                    count++
                } else {
                    if (count > 0) {
                        tip_with_count += `${count}`
                        count = 0
                    }
                }
                tip_with_count += char
            }
            if (count > 0) {
                tip_with_count += `${count}`
            }
            return tip_with_count
        }

        /**
         * <font color="#ffffff">Ja.</font>
         */
        cleanStyle(line: string): string {
            return line.replace(/^<font [^>]*>/, "").replace(/<\/font>$/, "")
        }

        content() {
            return this.content_list.join(' ')
        }

        translation() {
            return this.translation_list.join('\n')
        }

        first_line() {
            return !!this.content_list ? this.content_list[0] : ''
        }

        last_line() {
            return !!this.content_list ? this.content_list[this.content_list.length - 1] : ''
        }

        time_str() {
            return `${this.start_time} --> ${this.end_time}`
        }
    }

    const compute_ms = (h: string, m: string, s: string, ms: string) => {
        return parseInt(h) * 60 * 60 * 1000 + parseInt(m) * 60 * 1000
            + parseInt(s) * 1000 + parseInt(ms)
    }

    const build_time_str = (time_ms: number) => {
        const h = `${Math.floor(time_ms / 1000 / 60 / 60)}`.padStart(2, '0')
        const m = `${Math.floor((time_ms / 1000 / 60) % 60)}`.padStart(2, '0')
        const s = `${Math.floor((time_ms / 1000) % 60)}`.padStart(2, '0')
        const ms = `${Math.floor(time_ms % 1000)}`.padStart(2, '0')
        return `${h}:${m}:${s},${ms}`
    }

    const parse_time_line = (time_line: string) => {
        const pattern = /((\d{2}):(\d{2}):(\d{2}),(\d{3})) --> ((\d{2}):(\d{2}):(\d{2}),(\d{3}))/
        const m = time_line.match(pattern)
        if (m) {
            return {
                start_time: m[1],
                start_ms: compute_ms(m[2], m[3], m[4], m[5]),
                end_time: m[6],
                end_ms: compute_ms(m[7], m[8], m[9], m[10]),
            }
        }
        return null
    }

    const build_time_line = (start_ms: number, end_ms: number) => {
        return `${build_time_str(start_ms)} --> ${build_time_str(end_ms)}`
    }

    const split_by_blank_line = (content: string) => {
        const lines = content.trim()
            .replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n')
        let result: string[][] = []
        let tmp: string[] = []
        for (let line of lines) {
            line = line.trim()
            if (line === '') {
                if (tmp.length > 0) {
                    result.push(tmp)
                    tmp = []
                }
                continue
            }
            tmp.push(line)
        }
        if (tmp.length > 0) {
            result.push(tmp)
        }
        return result
    }

    const merge_item = (item_list: Item[]) => {
        let new_list: Item[] = []
        for (const item of item_list) {
            if (new_list.length > 0
                && new_list[new_list.length - 1].last_line().match(/[a-zA-Z0-9äÄöÖüÜßé,:-]$/)
                && item.first_line().match(/^[0-9a-z]/)) {
                new_list[new_list.length - 1].append(item)
                continue
            }
            new_list.push(item)
        }
        for (let i = 0; i < new_list.length; i++) {
            new_list[i].position = i + 1
        }
        return new_list
    }

    export const parse_srt_content = (content: string, with_translation: boolean): ActionResult<Item[]> => {
        const block_list = split_by_blank_line(content)
        let error_list: string[] = []
        const item_list = block_list.map((v) => {
            const item = new Item(v, with_translation)
            if (item.init_status === 'error') {
                error_list.push(item.init_error)
            }
            return item
        })
            // remove empty items
            .filter((v) => v.content_list.length > 0)

        if (error_list.length === 0) {
            let merged_list = merge_item(merge_item(merge_item(item_list)))
            for (let i = 0; i < merged_list.length; i++) {
                // reset position of subtitle
                merged_list[i].position = i + 1
                // extend to last and next one, to listen and to understand better
                merged_list[i].extend_start_ms = i > 0 ?
                    merged_list[i - 1].start_ms : merged_list[i].start_ms
                merged_list[i].extend_end_ms = i + 1 < merged_list.length ?
                    merged_list[i + 1].end_ms : merged_list[i].end_ms
            }
            return { status: 'success', data: merged_list }
        }
        return { status: 'error', error: error_list.join('\n') }
    }

    export const build_srt_content = (item_list: Item[]): string => {
        let content = ""
        item_list.forEach((v) => {
            content += `${v.position}\n`
            content += `${build_time_line(v.start_ms, v.end_ms)}\n`
            if (v.content_list.length > 0) {
                content += `${v.content()}\n`
            }
            if (v.translation_list.length > 0) {
                content += `${v.translation()}\n`
            }
            content += `\n`
        })
        return content
    }

    /**
     * replace word with underline, with the length of word
     */
    export const hideWord = (content: string) => {
        const tip = content.replaceAll(/[a-zA-Z0-9äÄöÖüÜßé]/g, '_')
        let count = 0
        let tip_with_count = ''
        for (const char of tip) {
            if (char === '_') {
                count++
            } else {
                if (count > 0) {
                    tip_with_count += `${count}`
                    count = 0
                }
            }
            tip_with_count += char
        }
        if (count > 0) {
            tip_with_count += `${count}`
        }
        return tip_with_count
    }

    /**
     * used for simply check success, ignore non-words
     */
    export const pureContent = (content: string) => {
        return content.replaceAll(/[^a-zA-Z0-9äÄöÖüÜßé]/g, '')
    }

    /**
     * used for process content word by word
     */
    export const splitContent = (content: string, onlyWord: boolean) => {
        let parts: { isWord: boolean, content: string }[] = []
        let tmp = ''
        for (const char of content) {
            if (char.match(/[a-zA-Z0-9äÄöÖüÜßé]/)) {
                tmp += char
                continue
            }
            if (tmp !== '') {
                parts.push({ isWord: true, content: tmp })
                tmp = ''
            }
            if (!onlyWord) {
                parts.push({ isWord: false, content: char })
            }
        }
        if (tmp !== '') {
            parts.push({ isWord: true, content: tmp })
        }
        return parts
    }

    export const from_breakpoints = (breakpoints_ms: number[]) => {
        let result: Item[] = []
        for (let i = 1; i < breakpoints_ms.length; i++) {
            const block = [
                `${i}`,
                build_time_line(breakpoints_ms[i - 1], breakpoints_ms[i]),
                'content',
            ]
            result.push(new Item(block, false))
        }
        return result
    }
}