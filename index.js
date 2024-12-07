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
                } else {
                    const ICP = res[0].ICP.replaceAll("a", "")
                    const email = res[0].email
                    const sites = res[0].site.split(",")
                    console.log(ICP, email, sites)
                    result.innerHTML = `
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">星ICP备${ICP}号</h5>
                        </div>
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">备案者：${email}</h6>
                            <p class="card-text">备案域名：(${sites.length}个)<br>${sites.map(site => { return `<a href="https://${site}">${site}</a>` }).join("<br/>")}</p>
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