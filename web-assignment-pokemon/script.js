window.addEventListener("load", function(){

    // Your client-side JavaScript here

    // All data from the server must be accessed via AJAX fetch requests.
    
    //variable for total pokemon count
    var totalPokemonCount;
    //variable for current pokemon detail
    var currentpokemonDetail;
    //conatant of type info table column count
    const tableInfoColumnCount = 2;
    //const of offense table header names
    const headerNames_OffenseInfo = ["Defending type","Damage dealt"];
    //const of offense table header names
    const headerNames_DefenseInfo = ["Attacking type","Damage received"];
    //constant of POKEMON Id prefix 
    const prefixId = "id-";
    //constant of localstorage prefix
    const prefixLocalStorage = "favoritePokemonID-"
    /** 
     * retrive common use html element
     */
    //add/Remove favorite button
    const btn_like = document.querySelector("#btn-like");
    //remove all favorite btn
    const btn_RemoveAll = document.querySelector("#remove-all");
    //show selected favorite details button
    const btn_ShowDetails = document.querySelector("#show-detail");
    //remove selected favorite button
    const btn_Remove = document.querySelector("#remove");
    
    //Test localStorage
    //this.localStorage.clear();

    //initilaise page
    initialisePage();

     //dispaly all pokemon on left sidebar
     displayAllPokemon();

     //display all favotire pokemon images on Favorites section
     displayFavoritePokemon();
    
    function disableRemoveAllButton() {
        const flag = isHavingFavorite();
        btn_RemoveAll.disabled = !flag;
        /*
        if(flag) {
            btn_RemoveAll.disabled = false;
        }else{
            btn_RemoveAll.disabled = true;
        }
        */
    }
    
    function disableClickedFavoriteButton() {
        let flag = isClickedFavorite();
        btn_ShowDetails.disabled = !flag;
        btn_Remove.disabled = !flag;
    }

    function isClickedFavorite() {
        const clickedFavorite = document.querySelector(".favorite-clicked");
        return (clickedFavorite == null ) ? false : true;
        /*
        if(clickedFavorite == null ){
            return false;
        }else {
            return true;
        }
        */
    }
    
    btn_RemoveAll.addEventListener("click", function() {
        Object.keys(localStorage).forEach(function(key) {
            if(key.startsWith(prefixLocalStorage)){
                localStorage.removeItem(key);
            }
        });
        //refresh favorite section
        displayFavoritePokemon();
        //no favorite items, change btn_like to "Add to Favorite"
        setUpFavoriteButttonStyle("dislike");
    });

    btn_ShowDetails.addEventListener("click", function(event) {
        const selectedId = getClickedFavoriteID();
        const dexNumber = selectedId.slice(prefixLocalStorage.length);
        //add selected pokemon css class
        const selectedFavorite = document.querySelector(`#${prefixId}${dexNumber}`);
        addSelectedPokemonClass(selectedFavorite);
        //console log dexNumber
        console.log(dexNumber);
        //refres details section
        displaySinglePokemonDetail(dexNumber);
        //TODO btn like text not correct
    });

    btn_Remove.addEventListener("click", function(event) {
        //remove selected item from localStorage
        const selectedId = getClickedFavoriteID();
        console.log(selectedId);
        removeSingleFavorite(selectedId);
        //refresh favorite section
        displayFavoritePokemon();
        //if selected item is on Main content, then change like button to "Add to Favorite"
        console.log("currentpokemonDetail.dexNumber: " + currentpokemonDetail.dexNumber);
        console.log("selectedId.slice(prefixLocalStorage.length): " + selectedId.slice(prefixLocalStorage.length));
        if(currentpokemonDetail.dexNumber == selectedId.slice(prefixLocalStorage.length)){
            console.log("btn_like.value: " + btn_like.value )
            setUpFavoriteButttonStyle(btn_like.value);
        }
    });

    function getClickedFavoriteID() {
        return document.querySelector(".favorite-clicked").id;
    }

   
    btn_like.addEventListener("click", function(event) {
        const btnValue = event.target.value;
        setUpFavoriteButttonStyle(btnValue);
        if(btnValue === "like"){
            addToFavorite();
        }else{
            removeFromFavorite();
        }
        displayFavoritePokemon();
    });

    function setUpFavoriteButttonStyle(btnValue) {
        //if current value is like, then enable dislike 
        //otherwise, enable like
        if(btnValue === "like"){
            btn_like.value = "dislike";
            btn_like.innerText = "Remove from Favorite"
        }else{
            btn_like.value = "like";
            btn_like.innerText = "Add to Favotrtie"
        }
    }

    function isHavingFavorite() {
        console.log("Favorites length: " + Object.keys(localStorage).length);
        console.log("Favorites: " + Object.keys(localStorage));
        for (const key of Object.keys(localStorage)) {
            console.log(key);
            if(key.startsWith(prefixLocalStorage)){
                return true;
            }
        }
        return false;
    }

    function addToFavorite (){
        //localstorage reference:
        //1.https://www.w3schools.com/jsref/prop_win_localstorage.asp
        //2.https://blog.logrocket.com/localstorage-javascript-complete-guide/

        //check if selected pokemon exists
        if(!isSelectedPokemonInFavorites(prefixLocalStorage + currentpokemonDetail.dexNumber)){
            //not exist, add to localstorage favorite list
            const key = prefixLocalStorage + currentpokemonDetail.dexNumber;
            //console.log(JSON.stringify(currentpokemonDetail));
            localStorage.setItem(key, JSON.stringify(currentpokemonDetail));
            const image = createImageElement(key, currentpokemonDetail.imageUrl, key);
            addImagetoFavorites(image);
        }
    }

    function addImagetoFavorites(image) {
        image.classList.add("favorite-img");
        document.querySelector("#favorite-nav").appendChild(image);
    }

    function isSelectedPokemonInFavorites(key) {
        const selectedPokemon = localStorage.getItem(key);
        console.log("selectedPokemon" + selectedPokemon);
        if(selectedPokemon == null){
            return false;
        }else{
            return true;
        }
    }

    function removeFromFavorite (){
        const localStorgeyKey = prefixLocalStorage + currentpokemonDetail.dexNumber;
        removeSingleFavorite(localStorgeyKey);
        /*
        //selected pokemon is in favorite list, remove it
        if(isSelectedPokemonInFavorites(currentpokemonDetail)){
            localStorage.removeItem(prefixLocalStorage + currentpokemonDetail.dexNumber);
        }
        */
        
    }

    function removeSingleFavorite(key) {
        //selected pokemon is in favorite list, remove it
        if(isSelectedPokemonInFavorites(key)){
            localStorage.removeItem(key);
        }

    }
    
    function addSelectedPokemonClass(selectedPokemon) {
        if(selectedPokemon == null) {
            return;
        }
        //remove previous selected class
        const pokemons = document.querySelectorAll("#all-pokemon td"); 
        pokemons.forEach(function(pokemon) {
            pokemon.classList.remove("pokeSelected");  
        });
        //add selected pokemon classlist
        selectedPokemon.classList.add("pokeSelected");
    }

    async function displayAllPokemon() {
        //get all-pokemon container
        const allPokemons = document.querySelector("#all-pokemon");
        //fetch all pokemon information from endpoint:trex-sandwich.com
        let allPokemonResponseObj = await fetch(" https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon");
        //Use the fetch API response.json() method to get a JSON object from the response
        let allPokemonArray = await allPokemonResponseObj.json();
        //console allPokemon information
        console.log(allPokemonArray);
        //loop to display all pokemons on the left sidebar
        totalPokemonCount = allPokemonArray.length;
        for(let i = 0; i < allPokemonArray.length; i++) {
            const tRow = document.createElement("tr");
            const tCol = document.createElement("td");
            tCol.setAttribute("id", `${prefixId}${allPokemonArray[i].dexNumber}`);
            tCol.innerText = allPokemonArray[i].name;
            tRow.appendChild(tCol);
            allPokemons.appendChild(tRow);
            //add click event listener for each pokemon
            tCol.addEventListener("click", function(event) {
                //add selected pokemon css class
                addSelectedPokemonClass(event.target);
                //get dexNumber of selected pokemon
                const dexNumber = event.target.id.slice(prefixId.length);
                //console log dexNumber
                console.log(dexNumber);
                displaySinglePokemonDetail(dexNumber);
            });
        }

    }

    function displayFavoritePokemon(){
        const favoriteNav = document.querySelector("#favorite-nav");
        favoriteNav.innerHTML = "" ;
        Object.keys(localStorage).forEach(key => {
            console.log(`${key} - ${localStorage.getItem(key)}`);
            //const div = document.querySelector("div");
            const jsonObj = JSON.parse(localStorage.getItem(key));
            console.log(jsonObj);
            const image = createImageElement(key, jsonObj.imageUrl, key);
            image.addEventListener("click" , function(event) {
                document.querySelectorAll("#favorite-nav img").forEach( item =>
                    item.classList.remove("favorite-clicked")
                );
                event.target.classList.add("favorite-clicked");
                disableClickedFavoriteButton();
            });
            addImagetoFavorites(image);
        });
        
        disableRemoveAllButton();
        disableClickedFavoriteButton();
    }

    async function initialisePage() {
        //first load/refresh:a random Pokemon should be loaded as the selected Pokemon
        let randomPokemonResponseObj = await fetch("https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/random");
        //Use the fetch API response.json() method to get a JSON object from the response
        let randomPokemonDetail = await randomPokemonResponseObj.json();
        //console random pokemon detail
        console.log(randomPokemonDetail);
        currentpokemonDetail = randomPokemonDetail;
        //add selected pokemon css class
        console.log(document.querySelector("#id-"+currentpokemonDetail.dexNumber));
        addSelectedPokemonClass(document.querySelector("#id-"+currentpokemonDetail.dexNumber));
        updatePokemondetail();
        
    }

    async function displaySinglePokemonDetail(dexNumber) {
        //fetch selected pokemon detail from endpoint:https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/:dexNumber
        let singlePokemonresponseObj = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/${dexNumber}`);
        //check response status
        if (singlePokemonresponseObj.status === 404) {
            alert("Not Found - the ID we were searching for doesn'texist");
            return;
        }
        //Use the fetch API response.json() method to get a JSON object from the response
        let singlePokemonDetail = await singlePokemonresponseObj.json();
        //console log single pokemon detail
        console.log(singlePokemonDetail);
        currentpokemonDetail = singlePokemonDetail;
        updatePokemondetail();
        
    }

    function createImageElement(id, src, name){
        const img = document.createElement("img");
        img.id = id;
        img.src = src;
        img.alt = name;
        img.title = name;
        return img;

    }
  
    function updatePokemondetail() {
        //display name
        document.querySelector("#name").innerText = currentpokemonDetail.name;

        //display image
        const imgContainer = document.querySelector("#img-container");
        //clear imgContainer
        imgContainer.innerHTML = "";
        const img = createImageElement("pokeimg", currentpokemonDetail.imageUrl, currentpokemonDetail.name);
        imgContainer.appendChild(img);

        //display dexNumber
        document.querySelector("#pokedex").innerText = currentpokemonDetail.dexNumber;

        //display description
        document.querySelector("#description").innerText = currentpokemonDetail.dexEntry;

        //displayTypeInfo
        displayPokemonTypeInfo();

        //set up button stype
        console.log(currentpokemonDetail.dexNumber);
        setUpFavoriteButttonStyle(isSelectedPokemonInFavorites(prefixLocalStorage 
            + currentpokemonDetail.dexNumber) ? "like" : "dislike");

    }

    function displayPokemonTypeInfo() {
        //update pokemon name
        document.querySelector("#selectedokemon").innerText = currentpokemonDetail.name;
        //update pokemon types
        document.querySelector("#typelist").innerText = currentpokemonDetail.types.toString();
        //update offense info
        updateOffenseInfo();
        //update defense Info
        updateDefenseInfo();
    }

    async function updateOffenseInfo() {
        //if no pokemon type, return
        if(currentpokemonDetail.types == undefined || currentpokemonDetail.types.length === 0){
            return;
        }
        //update offense info by pokemon type
        currentpokemonDetail.types.forEach(type => updateOffenseInfoByType(type));

    }

    async function updateOffenseInfoByType(type){
        //get offense type info container
        const offenseInfo = document.querySelector("#offense");
        //clear previous info
        offenseInfo.innerHTML = "";
        //fetch offense info by type
        let offenseInfoResponseObj = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/types/${type}`);
        //Use the fetch API response.json() method to get a JSON object from the response
        let offenseInfoJson = await offenseInfoResponseObj.json();
        //console log offense info
        console.log(offenseInfoJson);
        const headerNamesArray = [[`${type} type attacks:`], headerNames_OffenseInfo];
        //display offense info in a table
        displayTypeInfoInTable(offenseInfo, headerNamesArray, offenseInfoJson.offenseDamageMultipliers);

    }
    
    async function updateDefenseInfo() {
        //get defense info container
        const defenseInfo = document.querySelector("#defense");
        //clear previous info
        defenseInfo.innerHTML = "";
        //fetch defense info by dexNumber
        const dexNumber = currentpokemonDetail.dexNumber;
        let defenseInfoResponseObj = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/${dexNumber}/defense-profile`);
        //Use the fetch API response.json() method to get a JSON object from the response
        let defenseInfoJson = await defenseInfoResponseObj.json();
         //console log defense info
         console.log(defenseInfoJson);
         //display defense info in a table
         displayTypeInfoInTable(defenseInfo, [headerNames_DefenseInfo], defenseInfoJson);
    }

    function multiplierMapToString(multiplier) {
        //switch concept from COMPSCI-718
        switch(multiplier) {
            case 0 :
                return "No damage";
            case 0.25 :
                return "Quarter damage";
            case 0.5 :
                return "Half damage";
            case 1 :
                return "Normal damage";
            case 2 :
                return "Double damage";
            case 4 :
                return "Quadruple damage";
            default:
                return "can't map multiplier to a string"   
        }

    }

    function displayTypeInfoInTable(container, headerNamesArray, typeInfoMultipliers){
         //create table for type info
         const infoTable = document.createElement("table");
         //create table head element
         const tHead = document.createElement("thead");
         //create header
         headerNamesArray.forEach(function(headerNames) {
            createTypeInfoHeaderRow(tHead, headerNames);
         });
         // append thead to table
         infoTable.appendChild(tHead);
         //create table body element
         const tBody = document.createElement("tbody");
         createTypeInfoTableContent(tBody, typeInfoMultipliers);
        //append tbody to table
        infoTable.appendChild(tBody);
         //append table to offense info div
         container.appendChild(infoTable);

    }

    function createTypeInfoHeaderRow(tHead, headerNames) {
        const thRow = document.createElement("tr");
        for(let i = 0; i < headerNames.length; i++){
            const thCell = document.createElement("th");
            thCell.innerText = headerNames[i];
            if(headerNames.length < tableInfoColumnCount) {
                thCell.setAttribute("colspan", tableInfoColumnCount);
            }
            thRow.appendChild(thCell);
        }
        tHead.appendChild(thRow);

    }

    function createTypeInfoTableContent(tBody, infoMultipliers){
        infoMultipliers.forEach(function(info){
            const tbRow = document.createElement("tr");
            const tbCol1 = document.createElement("td"); 
            const tbCol2 = document.createElement("td"); 
            tbCol1.innerText = info.type;
            tbCol2.innerText = multiplierMapToString(info.multiplier);
            tbRow.appendChild(tbCol1);
            tbRow.appendChild(tbCol2);
            tBody.appendChild(tbRow);
        });

    }

});