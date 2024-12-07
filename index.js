window.xingicp = null

function isValidDomain(domain) {
    const domainRegex = /^(?!:\/\/)(?=.{1,255}$)((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;
    return domainRegex.test(domain);
}

onload = e => {
    console.log(e)
    xingicp = new pgdbs(dbs_5c724bd3de34a72c601f1c9449c9a193fd039dbd8025a670ca098a88a2ebdeb8)
    icp.onkeydown = async e => {
        if (e.key == 'Enter') {
            if (icp.value.trim().replaceAll(" ", "") && Number(icp.value.trim().replaceAll(" ", "")) != "number" && icp.value.trim().replaceAll(" ", "").length == 8) {
                const json = await xingicp.getTableData({
                    filter: `ICP="a${icp.value}"`,
                    limit: 1,
                    page: 1,
                })
                const res = json.fields
                if (res.length == 0) {
                    result.innerHTML = `<div class="alert alert-warning" role="alert">
                                            未找到此备案号
                                        </div>`
                } else {
                    const ICP = res[0].ICP.replaceAll("a", "")
                    const email = res[0].email
                    const sites = res[0].site.split(",")
                    const audit = res[0].audit
                    console.log(ICP, email, sites, audit)
                    result.innerHTML = `
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">星ICP备${ICP}号</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${audit == 0 ? "备案审核中" : (audit == 1 ? "备案通过" : (audit == 2 ? "备案未通过" : "未知备案状态"))}</h6>
                        </div>
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">备案者：<a href="mailto:${email}">${email}</a></h6>
                            <p class="card-text">备案域名和作品：(${sites.length}个)<br>${sites
                            .map(site => {
                                const dd = site.split("->")
                                if (dd[0] == "coco") {
                                    return `<a href="https://coco.codemao.cn/editor/player/${dd[1]}?channel=h5" target="_blank">Coco${d[1]}</a>`
                                } else if (dd[0] == "kn") {
                                    return `<a href="https://kn.codemao.cn/player?type=2&workId=${dd[1]}" target="_blank">KN${d[1]}</a>`
                                } else if (dd[0] == "kitten") {
                                    return `<a href="https://player.codemao.cn/new/${dd[1]}" target="_blank">Kitten${dd[1]}</a>`
                                } else if (dd[0] == "nemo") {
                                    return `<a href="https://nemo.codemao.cn/w/${dd[1]}/${dd[1]}" target="_blank">Nemo${d[1]}</a>`
                                } else if (dd[0] == "voto") {
                                    return `<a href="https://voto.pages.dev/player/${dd[1]}" target="_blank">Voto${dd[1]}</a>`
                                }
                                return `<a href="https://${site}" target="_blank">${site}</a>`
                            }).join("<br/>")}</p>
                        </div>
                    </div>`
                }
            } else {
                alert('请输入正确的ICP')
            }
        }
    }
    icp.oninput = e => {
        icp.value = icp.value.replaceAll(/[^0-9]/g, "")
        if (icp.value.trim()) {
            result.innerHTML = ""
        }
    }
}