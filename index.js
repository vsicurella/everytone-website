const sitemap = document.getElementById('sitemap-section')
const sidebar = document.getElementById('product-sidebar-section')
const contentBody = document.getElementById('site-body-section')

let readme;
let readmeVersion;
let releases;

function addDownloadSection(parent, productCode, name, release) {
    let header = document.createElement('h2')
    header.innerText = name + ': ' + release

    let section = document.createElement('div')
    section.id = productCode + '-' + name.toLowerCase() + '-download-container'
    section.classList = 'sidebar download flex'

    parent.appendChild(header)
    parent.appendChild(section)

    return section
}

function addToDownloadSection(parent, platform, url) {
    let imgSrc = './assets/' + platform + '-logo.'

    if (platform === 'linux' || platform === 'ios') imgSrc += 'png'
    else                                            imgSrc += 'svg'

    let download = document.createElement('a')
    download.href = url
    download.classList = 'download btn'

    let img = document.createElement('img')
    img.src = imgSrc
    download.appendChild(img)

    parent.appendChild(download)
}

// Pull README.md html
fetch('http://api.github.com/repos/vsicurella/SuperVirtualKeyboard/readme', {
    method: 'GET',
    headers: {
        'Accept': 'application/vnd.github.v3.html'
    }
})
.then(response => response.text())
.then(result => {
    readme = document.createRange().createContextualFragment(result)
    readmeVersion = result.match(/v\d\.\d\d/)[0].slice(1)

    let latestVersion = document.createElement('h2')
    latestVersion.innerText = "Master branch version: " + readmeVersion
    document.getElementById('svk-sidebar').appendChild(latestVersion)

    // remove some nodes
    Array.from(readme.querySelectorAll('path')).forEach(el => el.remove())
    let ps = Array.from(readme.querySelectorAll('p'))
    ps[0].remove()
    ps[1].querySelector('img').src = './assets/svk-hero0.gif'

    document.getElementById('site-body-container').appendChild(readme)
})
.then(
    // Find latest release and build download buttons
    fetch('https://api.github.com/repos/vsicurella/SuperVirtualKeyboard/releases', {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(response => {
        releases = response
        latest = releases[0]
        let productCode = 'svk'
        let container = document.getElementById(productCode + '-sidebar')
        let flavors = {}
        latest.assets.forEach(a =>{

            console.log("Reading asset:")
            console.log(a)
            
            let type = a.name.match(/(_VSTi)|((_Android)|(_iOS))/)
            if (type)
                type = type[0] === '_VSTi' ? 'VSTi' : 'Mobile'
            else
                type = "Standard"

            let section = flavors['type']

            if (!section)
            {
                section =  addDownloadSection(container, productCode, type, latest.tag_name)
                flavors['type'] = section
                console.log("Added " + type + " section")
                console.log(section)
            }

            let platform = a.name.match(/(_Win)|(_Mac)|(_Linux)|(_Android)|(_iOS)/)[0].slice(1).toLowerCase()
            console.log("Platform: " + platform)

            addToDownloadSection(section, platform, a.browser_download_url)
        })
    })
)
