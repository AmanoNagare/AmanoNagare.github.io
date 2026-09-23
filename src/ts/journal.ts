declare const marked: any;
marked.use({breaks: true});

let journal_list_elem = document.getElementById("journal-list");
class SimpleDate{
    public y: number
    public m: number
    public d: number
    constructor(y: number, m: number, d: number){
        this.y = y;
        this.m = m;
        this.d = d;
    }
    next(){
        this.d++;
        if(!this._valid(this.y, this.m, this.d)){
            this.m++;
            this.d = 1;
            if(this.m > 12){
                this.y++;
                this.m = 1;
            }
        }
    }
    prev(){
        this.d--;
        if(this.d < 1){
            this.m--;
            this.d = this._last_day(this.y, this.m);
            if(this.m < 1){
                this.y--;
                this.m = 12;
            }
        }
    }
    clone(): SimpleDate{
        return new SimpleDate(this.y, this.m, this.d);
    }
    to_int(): number{
        let y = this.y;
        let m = this.m;
        if(m <= 2){
            y -= 1;
            m += 12;
        }
        return 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + Math.floor(306 * (m + 1) / 10) + this.d - 428;
    }
    _valid(y: number, m: number, d: number): boolean{
        return 1 <= d && d <= this._last_day(y, m);
    }
    _last_day(y: number, m: number): number{
        if([1, 3, 5, 7, 8, 10, 12].includes(m))return 31;
        if(m == 2){
            if((y % 4 == 0 && y % 100 != 0) || y % 400 == 0)return 29;
            return 28
        }
        return 30;
    }
}

function today(): SimpleDate{
    let d = new Date();
    return new SimpleDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

class Rainee{
    public date: SimpleDate;
    private content: string | null;
    public constructor(date: SimpleDate){
        this.date = date;
        this.content = null;
    }
    public async fetch(): Promise<void>{
        this.content = await this.get_journal_to_string();
    }
    public append_to(parent_elem: HTMLElement){
        if(this.content === null)return;

        const parsed_elem = document.createElement('div');
        parsed_elem.innerHTML = this.get_html();
        const card_elem = this.create_card();
        for(const entry_elem of this.group_entries(parsed_elem.children))card_elem.appendChild(entry_elem);
        parent_elem.appendChild(card_elem);
    }
    private async get_journal_to_string(): Promise<string | null>{
        const mm = String(this.date.m).padStart(2, '0');
        const dd = String(this.date.d).padStart(2, '0');
        const url = `data/${this.date.y}-${mm}-${dd}.md`;
        let res = await fetch(url);
        return res.ok ? await res.text() : null;
    }
    // 日付タイトルを含む日誌カードのアウトラインつくりましょ
    private create_card(): HTMLDivElement{
        const card_elem = document.createElement('div');
        card_elem.className = "rounded-2xl bg-white shadow-md p-6";
        const title_elem = document.createElement('div');
        title_elem.className = "text-2xl font-bold mb-4";
        title_elem.textContent = this.get_title();
        card_elem.appendChild(title_elem);
        return card_elem;
    }

    // Markdownのh3見出しを変換しますわよ
    private create_time_element(heading_elem: Element): HTMLDivElement{
        const time_elem = document.createElement('div');
        time_elem.className = "font-semibold text-xl";
        time_elem.innerHTML = heading_elem.innerHTML;
        return time_elem;
    }

    // h3から次のh3までの要素を時刻ごとにまとめますわよ
    private group_entries(elements: HTMLCollection): HTMLDivElement[]{
        const entries: HTMLDivElement[] = [];
        let current_entry: HTMLDivElement | null = null;
        for(const child of Array.from(elements)){
            if(child.tagName.toLowerCase() === "h3"){
                current_entry = document.createElement('div');
                current_entry.className = "mt-10 mb-10 text-lg space-y-2";
                current_entry.appendChild(this.create_time_element(child));
                entries.push(current_entry);
            }else if(current_entry){
                current_entry.appendChild(child);
            }
        }
        return entries;
    }

    private get_html(): string{
        return marked.parse(this.content);
    }

    private get_title(): string{
        const mm = String(this.date.m).padStart(2, '0');
        const dd = String(this.date.d).padStart(2, '0');
        return `Amano Nagare 日誌エントリ${this.date.y}${mm}${dd}`;
    }
}
async function main(){  
    let d = new SimpleDate(2026, 9, 1);
    let t = today();
    let promise_vec = [];
    let rainee_vec = [];
    let n = t.to_int() - d.to_int();
    if(!journal_list_elem)throw new Error("Element jounal-list not found");
    for(let i=0;i<=n;i++){
        const rainee = new Rainee(d.clone());
        promise_vec.push(rainee.fetch());
        rainee_vec.push(rainee);
        d.next();
    }
    await Promise.all(promise_vec);
    rainee_vec.sort((a, b) => b.date.to_int() - a.date.to_int());
    for(const rainee of rainee_vec)rainee.append_to(journal_list_elem);
}

main();