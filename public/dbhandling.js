const params = (new URL(location)).searchParams
document.getElementById("output").innerHTML=params.get("id")

function senddrawreq(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            arrowtype=""
            desc=""
            console.log(xhttp.response)
            switch(xhttp.response){
                case "empty":
                    //Quiver is empty
                    arrowtype="No Arrow"
                    desc="Your quiver is empty and the enchantment wears off"
                    document.getElementById('drawbutton').disabled=true;
                    break;
                case "0":
                    //normal arrow
                    arrowtype="Normal Arrow"
                    desc="Standard Arrow... made of boom wood 1d8"
                    break;
                case "1":
                    //lightning arrow
                    arrowtype="Lightning Arrow"
                    desc="These arrows cast a streak of lightning in their wake. Any creatures within 5ft of a line between you and your target (including your target, but not yourself) must make a DC15 dex saving throw or take 1d8 lightning damage."
                    break;
                case "2":
                    //Explosive arrow
                    arrowtype="Explosive Arrow"
                    desc="These arrows explode on hit. All creatures within a 10ft radius must make a 15DC dex saving throw or take 2d10 fire damage. Ignites non-worn, non-carried flammable materials."
                    break;
                case "3":
                    //rope arrow
                    arrowtype="Rope Arrow"
                    desc="A 25ft rope is attached to the end of this strengthened arrow. 1d8"
                    break;
                case "4":
                    //broken arrow
                    arrowtype="Broken Arrow"
                    desc="Broken arrows are normally meant as a sign of peace. You aren't able to shoot it, so it would need to be used to stab in combat so it would count as an improvised weapon doing 1d4 damage"
                    break;
            }
                document.getElementById("arrowtype").innerHTML = arrowtype
                document.getElementById("arrowdesc").innerHTML = desc
            }
        }    
    xhttp.open("POST","/draw", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({"value":params.get("id")}));
}

function sendinitreq(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            console.log(xhttp.response);
        }
    };
    xhttp.open("POST","/init", true);
    xhttp.send();
}