const inputEl = document.getElementById("input");
const charTotal = document.getElementById("charTotal");
const wordCount = document.getElementById("wordCount");
const charNoSpace = document.getElementById("charNoSpace");
const sentenceCount = document.getElementById("sentenceCount");
const topWordList = document.getElementById("topWordList");



function boslukluKarakterHesapla(text){
    const count = text.length;
    charTotal.textContent = `${count}`;
}

function wordCountFunc(text){
    const count = text.split(/\s+/).length -1 ; // ozel regex
    wordCount.textContent = `${count}`;
}

function charNoSpaceFunc(text){
    const count = text.replace(/\s/g, "").length; // ozel regex
    charNoSpace.textContent = `${count}`;
}

function sentenceCountFunc(text){
    const count = text.match(/[.!?]+/g)?.length || 0;
    sentenceCount.textContent = `${count}`;
}

function topWord(text){

    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);

    const frequency = {};
    words.forEach (word => {
        frequency[word] = (frequency[word] || 0) + 1;
    })

    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
}

function kelimeAra(metin, aranan) {
  if (!aranan) {
    document.getElementById("searchResult").textContent = "-"
    return
  }
  
  const regex = new RegExp(aranan, "gi")
  const eslesme = metin.match(regex)
  const sayi = eslesme ? eslesme.length : 0
  
  document.getElementById("searchResult").textContent = `${sayi} kez geçiyor`
}

document.getElementById("searchInput").addEventListener("input", function() {
  kelimeAra(inputEl.value, this.value)
})


inputEl.addEventListener("input", function () {
    sentenceCountFunc(inputEl.value); // replace de noktalama temizlendigi icin oncesine almak lazim cumleyi
    const text = inputEl.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "");
    boslukluKarakterHesapla(text);
    wordCountFunc(text);
    charNoSpaceFunc(text);
    topWordList.innerHTML = ""
    topWord(text).forEach(([kelime, sayi]) => {
        const li = document.createElement("li")
        li.textContent = `${kelime}: ${sayi}`
        topWordList.appendChild(li)
    })


    
});
