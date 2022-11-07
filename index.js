let PROJECT_DATA = null;

// retrieve JSON from some URL asynchronously
function getJSON(url){
    return new Promise((res, rej) => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", url, false)
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200){
                res(JSON.parse(xhr.responseText))
                console.log(xhr)
            }
        }    
        xhr.send()
        console.log(xhr)
    })    
}

// populate the page with my projects (in data.json)
function populateProjects(){
    const PROJECT_CATEGORIES = PROJECT_DATA.CATEGORIES
    
    for (let cat of PROJECT_CATEGORIES){
        list = document.querySelector(`ul#${cat}-list`);
        console.log(list)
        for (let projData of PROJECT_DATA[cat]){
            let html = createProjectHTML(projData)
            if (!html) continue;
            // console.log(html)
            list.appendChild(html)
        }
    }
}

// create the html for an individual project
function createProjectHTML(data){
    if (!shouldShowProject(data)) return null;
    let li = document.createElement('li')
    let span = document.createElement('span')
    span.className = "projectLi"
    li.appendChild(span)
    li.innerHTML += `${data.title} | `

    const LINK_TYPES = Object.keys(PROJECT_DATA.LINK_TEMPLATES)

    for (let t of LINK_TYPES){
        if (!data[t]) continue
        const TDATA = PROJECT_DATA.LINK_TEMPLATES[t]

        const LINK_TEMPLATE = TDATA.link_template
        const ALT_TEMPLATE = TDATA.alt_template
        const IMG_ICON = TDATA.icon_url
        
        // create the link
        let a = document.createElement('a')
        a.href = LINK_TEMPLATE.replace("{}", data[t])
        
        // create the link icon
        let img = document.createElement('img')
        img.className = "linkicon"
        img.alt = ALT_TEMPLATE.replace("{}", data[t].title)
        img.src = IMG_ICON
       
        // append to the list item
        a.appendChild(img)
        a.innerHTML += " "
        li.appendChild(a)
    }

    return li
}

// whether we should display the project on the page 
// (only if there's a title and there's no "hidden" flag)
function shouldShowProject(data){
    return data.title && !("hidden" in data)
}

// load the project data and populate the page
async function main(){
    PROJECT_DATA = await getJSON("data.json")
    populateProjects()
}

main()

