window.xingicp = null
onload = e => {
    console.log(e)
    xingicp = new pgdbs(dbs_5c724bd3de34a72c601f1c9449c9a193fd039dbd8025a670ca098a88a2ebdeb8)
    icp.onkeydown = async e => {
        if (e.key == 'Enter') {
            const json = await xingicp.getTableData({
                filter: `ICP='${icp.value}'`,
                limit: 1,
                page: 1,
            })
            const res = json.fields
            if (res.length == 0) {
            } else {
            }
        }
    }
}