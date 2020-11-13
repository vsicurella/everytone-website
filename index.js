const sidebarContainer = document.getElementById('product-sidebar-container')
const contentContainer = document.getElementById('site-body-container')

let currentBody;
let currentSidebar;
let currentGitUrl;

function addDownloadSection(parent, productCode, name, version) {
    let header = document.createElement('h2')
    header.innerText = name + ': v' + version

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

async function setupProductBody(owner, repoName, productCode) {

    currentGitUrl = 'http://api.github.com/repos/' + [owner, repoName, ''].join('/')
    
    containerId = productCode + '-body'
    currentBody = document.getElementById('product-body-overview').cloneNode()
    currentBody.id = containerId
    currentBody.classList.toggle('template')
    currentBody.classList.toggle('active')

    sidebarId = productCode + '-sidebar'
    currentSidebar = document.getElementById('product-sidebar').cloneNode(true)
    currentSidebar.id = sidebarId
    currentSidebar.classList.toggle('template')
    currentSidebar.classList.toggle('active')

    contentContainer.append(currentBody)
    sidebarContainer.appendChild(currentSidebar)

    // Pull README.md html
    let readme = await fetch(
        currentGitUrl + 'readme', {
            method: 'GET',
            headers: { 'Accept': 'application/vnd.github.v3.html' }
        })
    if (!readme.ok) {
        readme = '<span> 404 </span>'
    } else {
        readme = await readme.text()
        
        let mainBranchVersion = readme.match(/v\d\.\d\d/)[0].slice(1)

        // Pull latest source version
        let latestVersion = currentSidebar.querySelector('h2')
        latestVersion.innerText += 'v' + mainBranchVersion
        currentSidebar.querySelector('#github-link').href += [owner, repoName, ''].join('/')

        readme = document.createRange().createContextualFragment(readme)

        // remove some nodes
        Array.from(readme.querySelectorAll('path')).forEach(el => el.remove())
        let ps = Array.from(readme.querySelectorAll('p'))
        ps[0].remove()
        ps[1].querySelector('img').src = './assets/svk-hero0.gif'

        currentBody.appendChild(readme)

        // Find latest release and build download buttons
        let releases = await fetch(
            currentGitUrl + 'releases', {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            })
            .then(response => response.json())

        let latest = releases[0]
        let flavors = {}
        latest.assets.forEach(a => {

            let type = a.name.match(/(_VSTi)|((_Android)|(_iOS))/)
            if (type)
                type = type[0] === '_VSTi' ? 'VSTi' : 'Mobile'
            else
                type = "Standard"

            let section = flavors['type']

            if (!section) {
                section =  addDownloadSection(currentSidebar, productCode, type, latest.tag_name)
                flavors['type'] = section
            }

            let platform = a.name.match(/(_Win)|(_Mac)|(_Linux)|(_Android)|(_iOS)/)[0].slice(1).toLowerCase()

            addToDownloadSection(section, platform, a.browser_download_url)
        })
    }
}

document.getElementById('timestamp').innerText = new Date(document.lastModified).toDateString()

setupProductBody('vsicurella', 'SuperVirtualKeyboard', 'svk')