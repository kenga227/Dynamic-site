const template = document.querySelector("#myTemp").content;
const nav = document.querySelector(".nav");
let main = document.querySelector("main");
const allLink = document.querySelector("#all");
const modal = document.querySelector(".modalbg");

const closeBtn = document.querySelector("#close");

const pListLink = "http://kea-alt-del.dk/t5/api/productlist";
const pLink = "https://kea-alt-del.dk/t5/api/product?id=";
const catLink = "http://kea-alt-del.dk/t5/api/categories";
const imgLink = "https;//kea-alt-del.dk/t5/site/imgs/";

allLink.addEventListener("click", ()=> filter("all"));

fetch("http://kea-alt-del.dk/t5/api/categories").then(e => e.json()).then(data => build(data));

closeBtn.addEventListener("click", () => modal.classList.add("hide"));

function build(categories){
    categories.forEach(cat => {
        const section = document.createElement("section");
        const h2 = document.createElement("h2");
        const a = document.createElement("a");
        a.textContent = cat;
        a.href = "#";
        a.addEventListener("click", () => filter(cat));
        section.id = cat;
        h2.textContent = cat;
        main.appendChild(h2);
        main.appendChild(section);
        nav.appendChild(a);
    })

    fetch("http://kea-alt-del.dk/t5/api/productlist").then(e => e.json()).then(data => data.forEach(showData));
}

function filter(category){
    document.querySelectorAll("main section").forEach(section => {
        if (section.id == category || category == "all") {
            section.style.display = "grid";
            section.previousElementSibling.style.display = "block"
        } else {
            section.style.display = "none";
            section.previousElementSibling.style.display = "none"
        }
    })

}

function show(id){
    console.log(id);

    
   modal.querySelector(".modal-name").textContent = id.name;
    if (id.soldout) {
        modal.querySelector(".modal-price").textContent = "SOLD OUT";
        modal.querySelector(".modal-price").classList.remove("discount");
        modal.querySelector(".modal-price").classList.add("soldouth");
        modal.querySelector(".modal-old").classList.add("hide");
    } else if (id.discount > 0) {
        modal.querySelector(".modal-price").textContent = "Discount " + Math.round(id.price * (1 - id.discount / 100)) + ",- DKK";
        modal.querySelector(".modal-old").textContent = "Old Price: " + id.price + ", -DKK";
        modal.querySelector(".modal-price").classList.add("discount");
        modal.querySelector(".modal-old").classList.remove("hide");
    } else {
        modal.querySelector(".modal-price").textContent = id.price + ",- DKK";
        modal.querySelector(".modal-old").classList.add("hide");
        modal.querySelector(".modal-price").classList.remove("discount");
    }
    if (id.vegetarian) {
        modal.querySelector(".modal-veg").textContent = "Vegetarian";
    } else {
        modal.querySelector(".modal-veg").classList.add("hide");
    }
    if (id.alcohol > 0) {
        modal.querySelector(".modal-alc").textContent = "Alc.: " + id.alcohol + " %";
    } else {
        modal.querySelector(".modal-alc").classList.add("hide");
    }
    if (id.region) {
        modal.querySelector(".modal-reg").textContent = "Region: " + id.region;
    } else {
        modal.querySelector(".modal-reg").textContent = "Region: unknown";
    }
    if (id.allergens.length) {
        modal.querySelector(".modal-allerg").textContent = "Allergens: "
        modal.querySelector(".modal-allerg").textContent += id.allergens[0];
        for (let i = 1; i<id.allergens.length; i++) {
            modal.querySelector(".modal-allerg").textContent += ", " + id.allergens[i];
        }
    } else {
        modal.querySelector(".modal-allerg").textContent = "Allergens: none";
    }
    modal.querySelector(".modal-img").src = "https://kea-alt-del.dk/t5/site/imgs/large/" + id.image + ".jpg";
    modal.querySelector(".modal-img").alt = id.image;


    if (id.longdescription) {
        modal.querySelector(".modal-desc").textContent = id.longdescription;
    } else {
        modal.querySelector(".modal-desc").textContent = id.shortdescription;
    }

    modal.classList.remove("hide");
}
 
    
   

function showData(product){
    
    const section = document.querySelector("#" + product.category);
    const clone = template.cloneNode(true);
    
 clone.querySelector("h3").textContent = product.name;

    if (product.soldout) {
        clone.querySelector("h4").textContent = "SOLD OUT";
        clone.querySelector("img").classList.add("soldout");
        clone.querySelector("h4").classList.add("soldouth");
    } else if (product.discount) {
        clone.querySelector("h4").textContent = "Discount " + Math.round(product.price * (1 - product.discount / 100)) + ",- DKK";
        clone.querySelector("h4").classList.add("discount");
    } else {
        clone.querySelector("h4").textContent = product.price + ",- DKK";
    }

    clone.querySelector("img").src = "https://kea-alt-del.dk/t5/site/imgs/medium/" + product.image + "-md.jpg";
    clone.querySelector("img").alt = product.image;

    clone.querySelector("button").addEventListener("click", () => {
        fetch(pLink + product.id).then(e => e.json()).then(data => show(data));
    });

    clone.querySelector("p").textContent = product.shortdescription;


    if (product.vegetarian == true) {
        clone.querySelector(".veg").textContent = "Vegetarian";
    } else {
        clone.querySelector(".veg").classList.add("hide");
    }

    if (product.alcohol > 0) {
        clone.querySelector(".alc").textContent = "Alc.: " + product.alcohol + " %";
    } else {
        clone.querySelector(".alc").classList.add("hide");
    }
    

    section.appendChild(clone);
}   
    