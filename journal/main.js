marked.setOptions({breaks: true});

let journal_list_elem = document.getElementById("journal-list");
class SimpleDate{
    constructor(y, m, d){
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
    clone(){
        return new SimpleDate(this.y, this.m, this.d);
    }
    to_int(){
        let y = this.y;
        let m = this.m;
        if(m <= 2){
            y -= 1;
            m += 12;
        }
        return 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + Math.floor(306 * (m + 1) / 10) + this.d - 428;
    }
    _valid(y, m, d){
        return 1 <= d && d <= this._last_day(y, m);
    }
    _last_day(y, m){
        if([1, 3, 5, 7, 8, 10, 12].includes(m))return 31;
        if(m == 2){
            if((y % 4 == 0 && y % 100 != 0) || y % 400 == 0)return 29;
            return 28
        }
        return 30;
    }
}

function get_last_day(y, m){
    if([1, 3, 5, 7, 8, 10, 12].includes(m))return 31;
    if(m == 2){
        if((y % 4 == 0 && y % 100 != 0) || y % 400 == 0)return 29;
        return 28
    }
    return 30;
}

function appendJournal(parent_elem, date){
    let a_elem = document.createElement('a');
    const mm = String(date.m).padStart(2, '0');
    const dd = String(date.d).padStart(2, '0');
    const yy = String(date.y % 100).padStart(2, '0');
    a_elem.href = `data/${date.y}-${mm}-${dd}.md`;
    a_elem.textContent = `Amano Nagare 日誌エントリ${yy}${mm}${dd}`;
    a_elem.className = "block text-[#1a2075] hover:underline hover:text-[#ded103] font-bold";
    console.log(a_elem);
    parent_elem.appendChild(a_elem);
}

function sortJournalLinks(parent_elem){
    const items = Array.from(parent_elem.children);
    items.sort((a, b) => b.href.localeCompare(a.href));
    items.forEach(item => parent_elem.appendChild(item));
}

function today(){
    let d = new Date();
    return new SimpleDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

async function append_and_fetch_journal(parent_elem, date){
    const mm = String(date.m).padStart(2, '0');
    const dd = String(date.d).padStart(2, '0');
    const yy = String(date.y % 100).padStart(2, '0');
    const url = `data/${date.y}-${mm}-${dd}.md`;
    let res = await fetch(url);
    if(res.ok){
        let a_elem = document.createElement('a');
        a_elem.href = url;
        a_elem.textContent = `Amano Nagare 日誌エントリ${yy}${mm}${dd}`;
        a_elem.className = "block text-[#1a2075] hover:underline hover:text-[#ded103] font-bold";
        parent_elem.appendChild(a_elem);
    }
}

async function main(){  
    let d = new SimpleDate(2026, 9, 1);
    let t = today();
    let promise_vec = [];
    let n = t.to_int() - d.to_int();
    for(let i=0;i<=n;i++){
        promise_vec.push(append_and_fetch_journal(journal_list_elem, d.clone()));
        d.next();
        console.log(d);
    }
    await Promise.all(promise_vec);
    sortJournalLinks(journal_list_elem);
}

main();