let modal = document.getElementById("myModal");
let modalRowData = document.getElementById("rowData");
let modalCardData = document.getElementById("cardData");
let selectedRow = null;
let selectedColumn = null;
let span = document.getElementsByClassName("close")[0];
let dataKey = "data";

let rowTemplate = `<div class="row" ondrop="drop(event)" ondragover="allowDrop(event)">
<div class="title">
    <h2>Title</h2>
    <input type="button" value="-" class="cardButton btn" onClick="removeRowOrCard(event)">
</div>
<div class="titleBottom"></div>
<div class="cardSection">
    <div class="rowFooter">
        <input type="button" value="+" class="cardButton btn" onclick="addCard(event)">
    </div>
</div>
</div>`;

let cardTemplate = `<div class="card" draggable="true" ondragstart="drag(event)">
<div class="cardHeader">
    <h3>CardHeader</h3>
    <input type="button" value="-" class="cardButton btn" onClick="removeRowOrCard(event)">
</div>
<div class="cardBody">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos a cum ipsa maiores nihil ab nam! Aliquid consequuntur minima alias error hic, nam similique dolores officiis, accusantium, obcaecati modi repellat!</p>
</div>
</div>`;

/*
Data Schema:
[
    {
        "title",
        "cards" : [
            {
                "title",
                "text"
            }
        ]
    }
]
*/

function init(){
    //localStorage.setItem(dataKey,'[]');
    //localStorage.setItem(dataKey,JSON.stringify(json));
    let data = localStorage.getItem(dataKey);
    if(data!=null){
        try{
            let json = JSON.parse(data);
            console.log(json);
            let board = document.getElementById("board");
            board.innerHTML = "";
            for(let i=0; i<json.length; i++){
                let row = json[i];
                let rowTitle = row["title"];
                let cards = row.cards;
                board.innerHTML += rowTemplate;
                let rows = board.getElementsByClassName("row");
                let insertedRow = rows[rows.length-1];
                insertedRow.getElementsByTagName("h2")[0].innerText=rowTitle;
                insertedRow.setAttribute("id", row["id"]);

                for(let j=cards.length-1; j>=0; j--){
                    let card = cards[j];
                    let cardTitle = card["title"];
                    let cardData = card["text"];
                    let cardId = card["id"];
                    let cardSection = getCardSection(insertedRow);
                    cardSection.innerHTML = cardTemplate + cardSection.innerHTML;
                    let cardElems = insertedRow.getElementsByClassName("card");
                    let insertedCard = cardElems[0];
                    insertedCard.setAttribute("id", cardId);
                    insertedCard.getElementsByTagName("h3")[0].innerText = cardTitle;
                    insertedCard.getElementsByTagName("p")[0].innerText = cardData;
                }
            }
        }
        catch(e){
            console.log(e);
            localStorage.setItem(dataKey,'[]');
        }
    } else localStorage.setItem(dataKey,'[]');

}

function getData(){
    let data = localStorage.getItem(dataKey);
    let json = JSON.parse(data);
    return json;
}

function setData(json){
    localStorage.setItem(dataKey,JSON.stringify(json));
}

function addRow(){
    let rows = board.getElementsByClassName("row");
    if(rows.length>=6)
        alert("You can create maximum upto 6 rows. Otherwise create a new board");
    else{
        modalCardData.style.display = "none";
        modalRowData.style.display = "block";
        modal.style.display = "block";
    }
}

function createRow(){
    let title = document.getElementById("rowTitle").value;
    let board = document.getElementById("board");
    if(title=="")
        alert("Please Enter Some Value");
    else{
        board.innerHTML += rowTemplate;
        let rows = board.getElementsByClassName("row");
        let insertedRow = rows[rows.length-1];
        insertedRow.getElementsByTagName("h2")[0].innerText=title;
        let json = getData();
        let newId = Math.random()*1000;
        insertedRow.setAttribute("id", newId);
        let newRow = {
            "id": newId,
            "title": title,
            "cards": []
        };
        json.push(newRow);
        setData(json)
        closeModal();
    }
}

function addCard(e){
    modalCardData.style.display = "block";
    modalRowData.style.display = "none";
    modal.style.display = "block";
    selectedColumn = e.target.parentElement.parentElement;
}

function createCard(){
    let title = document.getElementById("cardTitle").value;
    let text = document.getElementById("cardText").value;
    if(title=="" || text=="")
        alert("Please Enter Some Value");
    else{
        selectedColumn.innerHTML = cardTemplate+selectedColumn.innerHTML;
        let cards = selectedColumn.getElementsByClassName("card");
        let insertedCard = cards[0];
        let newId = "card"+document.getElementsByClassName("card").length+(Math.random()*1000);
        insertedCard.setAttribute("id", newId);
        insertedCard.getElementsByTagName("h3")[0].innerText = title;
        insertedCard.getElementsByTagName("p")[0].innerText = text;
        let columnId = selectedColumn.getAttribute("id");
        let json = getData();
        for(let i=0; i<json.length; i++){
            if(json[i]["id"]==getRow(insertedCard).getAttribute("id")){
                let cards = json[i]["cards"];
                let card = {
                    "id": newId,
                    "title": title,
                    "text": text
                };
                cards.push(card);
                json[i]["cards"] = cards;
                break;
            }
        }
        setData(json);
        closeModal();
    }
}

function clearModalTexts(){
    document.getElementById("cardTitle").value = "";
    document.getElementById("cardText").value = "";
    document.getElementById("rowTitle").value = "";
}

function removeRowOrCard(e){
    let elem = e.target.parentElement.parentElement;
    let elemId = elem.id;
    let json = getData();
    if(elem.className=='row'){
        for(let i=0; i<json.length; i++){
            if(json[i]["id"]==elemId)
                json.splice(i, 1);
        }
        setData(json);
    }
    else{
        let row = getRow(elem);
        let rowId = row.id;
        for(let i=0; i<json.length; i++){
            if(json[i]["id"]==rowId){
                let cards = json[i].cards;
                for(let j=0; j<cards.length; j++){
                    if(cards[i]["id"]==elemId)
                        cards.splice(j, 1);
                }
                json[i].cards = cards;
            }
        }
        setData(json);
    }
    elem.remove();
}

function closeModal() {
  modal.style.display = "none";
  clearModalTexts();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    clearModalTexts();
  }
}

function allowDrop(e) {
    e.preventDefault();
  }

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function drop(e) {
    e.preventDefault();
    let cardId = e.dataTransfer.getData("text");
    let cardSection = getCardSection(e.target);
    cardSection.prepend(document.getElementById(cardId));
    let cardItem = null;
    let json = getData();
    for(let i=0; i<json.length; i++){
        let cards = json[i].cards;
        for(let j=0; j<cards.length; j++){
            let card = cards[j];
            if(card.id == cardId){
                cardItem = card;
                cards.splice(j, 1);
                json[i].cards = cards;
                break;
            }
        }
        if(cardItem!=null)
            break;
    }

    let rowId = getRow(cardSection).id;
    for(let i=0; i<json.length; i++){
        if(json[i]["id"]==rowId){
            json[i].cards.push(cardItem);
            break;
        }
    }
    setData(json);
}

function getCardSection(elem){
    while(elem!=null){
        if(elem.className=="row")
            break;
        elem = elem.parentElement;
    }
    return elem.getElementsByClassName("cardSection")[0];
}

function getRow(elem){
    while(elem!=null){
        if(elem.className=="row")
            break;
        elem = elem.parentElement;
    }
    return elem;
}