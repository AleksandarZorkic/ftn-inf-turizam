"use strict"

class Ture {
    constructor(naziv, opis, duzina, tagovi = []) {
        this.naziv = naziv
        this.opis = opis
        this.duzina = duzina
        this.tagovi = tagovi
    }
}

let tour = document.querySelector("#tour")
tour.setAttribute("border", "1")
tour.style.borderCollapse = "collapse";
tour.style.textAlign = "center"
tour.style.paddingTop = "20px"
tour.style.fontWeight = "normal"

let tourDetails = document.querySelector("#tourDetails")
tourDetails.style.border = "1px solid black"

let ture = []
let tagoviNiz = []

let addTagBtn = document.querySelector("#addTag")
let listaTagova = document.createElement("div")
listaTagova.id = "lista-tagova"
addTagBtn.insertAdjacentElement("afterend", listaTagova) 

function renderTags() {
    listaTagova.innerHTML = ""

    tagoviNiz.forEach((t, idx) => {
        let wrapper = document.createElement("div")
        wrapper.style.display = "flex"
        wrapper.style.alignItems = "center"
        wrapper.style.margin = "4px 0"

        let span = document.createElement("span")
        span.textContent = t
        span.style.marginRight = "8px"

        let btn = document.createElement("button")
        btn.type = "button"
        btn.textContent = "-"
        btn.style.cursor = "pointer"
        btn.addEventListener("click", () => {
            tagoviNiz.splice(idx, 1)
            renderTags()
        })

        wrapper.append(span, btn)
        listaTagova.appendChild(wrapper)
    })
}

addTagBtn.addEventListener("click", () => {
    const vrednost = document.querySelector("#tagovi").value.trim()
    if (!vrednost) return

    tagoviNiz.push(vrednost)
    renderTags()
    document.querySelector("#tagovi").value = ""
})

function createTourRow(ture) {
    let table = document.querySelector("#tour-body")
    table.innerHTML = ""

    for (let i = 0; i < ture.length; i++) {
        let tr = document.createElement("tr")

        let naziv = document.createElement("td")
        let opis = document.createElement("td")

        naziv.textContent = ture[i].naziv
        opis.textContent = ture[i].opis

        tr.addEventListener("click", () => displayTourDetails(ture[i]))

        tr.append(naziv, opis)
        table.appendChild(tr)
    }
}

function displayTourDetails(tura) {
    let p = document.createElement("p")
    p.innerHTML = 
        "Naziv: " + tura.naziv + "<br>" + 
        "Opis: " + tura.opis + "<br>" + 
        "Duzina: " + tura.duzina + "km" + "<br>" +
        "Tagovi: " + tura.tagovi.join(", ")

    let detalji = document.querySelector("#tourDetails")

    if (detalji.firstChild) {
        detalji.firstChild.remove()
    }
    detalji.appendChild(p)
}

function initializeRout() {
    const red = localStorage.getItem("ture")

    if (red) {
        ture = JSON.parse(red).map (o => 
            new Ture (o.naziv, o.opis, o.duzina, o.tagovi))
    }
    else {
        ture = [
            new Ture (
                "Kanjoning u Ovčarsko-Kablarskoj klisuri",
                "Avanturistička tura kroz rečne tokove i stene, idealna za ljubitelje prirode i adrenalina.",
                6,
                ["avantura", "planinarenje", "kanjoning"]),

            new Ture (
                "Pešačenje do vrha Rtanj",
                "Uspon na jedan od najmističnijih vrhova Srbije, sa spektakularnim pogledom.",
                10,
                ["planinarenje", "nacionalni park", "pogled"]
            ),
                
            
            new Ture (
                "Biciklistička tura Fruškom gorom",
                "Vožnja biciklom kroz vinograde, manastire i prirodne rezervate Fruške gore.",
                25,
                ["biciklizam", "priroda", "manastiri"]
            )
        ]
        localStorage.setItem("ture", JSON.stringify(ture))
    }
    createTourRow(ture)
}
document.addEventListener("DOMContentLoaded", () => {
    initializeRout(), 
    renderTags(), 
    handleFormSubmission()});

function handleFormSubmission() {
    let submitBtn = document.querySelector("#submitBtn")
    submitBtn.addEventListener("click", function() {
        const forma = document.querySelector("#forma")
        const formData = new FormData(forma)

        const naziv = formData.get("naziv")
        const opis = formData.get("opis")
        const duzina = formData.get("duzina")
        const tagovi = [...tagoviNiz]

        for (let i = 0; i < ture.length; i++) {
            if (naziv === ture[i].naziv)
                return
        }

        const novaTura = new Ture (naziv, opis, duzina, tagovi)
        ture.push(novaTura)

        localStorage.setItem("ture", JSON.stringify(ture))

        createTourRow(ture)
    })
}