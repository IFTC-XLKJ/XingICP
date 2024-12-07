let Email = ""
let isVerify = false
window.xingicp = null

onload = e => {
    const toast = new Toast();
    const Submit = document.querySelector("[type=submit]");
    xingicp = new pgdbs(dbs_5c724bd3de34a72c601f1c9449c9a193fd039dbd8025a670ca098a88a2ebdeb8)
    captchaBtn.onclick = () => {
        if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g.test(email.value)) {
            let t = Math.round(new Date().getTime() / 1000);
            let json = {
                key: "f7115d5ac87aedd4d42cf510ed064449",
                main: window.btoa(encodeURIComponent(`验证码为 {captcha} ，请在 <div style="display: inline;color: red;">2分钟</div> 内填写`)),
                to: email.value,
                count: 6,
                expired: 120,
                title: "VV账号注册验证码",
                t: t,
            }
            const id = toast.loading("发送中")
            ajax(json, "customize_sand", data => {
                if (data.status == "1") {
                    Email = email.value
                    toast.loadend(id)
                    toast.success("验证码已发送，请查看邮箱", 2000)
                } else {
                    toast.loadend(id)
                    toast.error(data.msg, 2000)
                }
            })
        } else {
            toast.error('邮箱格式不正确', 2000)
        }
    }
    captcha.oninput = e => {
        let t = Math.round(new Date().getTime() / 1000);
        let json = {
            "identity": Email,
            "code": captcha.value,
        }
        ajax(json, "customize", data => {
            if (data.code == 200) {
                captchaBtn.disabled = true
                captcha.disabled = true
                isVerify = true
            } else {
                toast.error("验证失败", 2000)
            }
        })
    }
    Submit.onclick = async e => {
        e.preventDefault();
        if (!icp.value.trim()) {
            toast.error("请输入ICP备案号", 2000)
            return
        }
        if (icp.value.length != 8) {
            toast.error("ICP备案号长度不正确", 2000)
            return
        }
        if (!isVerify) {
            toast.error("请先验证邮箱", 2000)
            return
        }
        const json = await xingicp.getTableData({
            filter: `ICP="a${icp.value}"`,
            page: 1,
            size: 1
        });
        console.log(json)
        if (json.fields.length == 0) {
            const data = await xingicp.setTableData({
                type: "INSERT",
                filter: "ICP,site,email,audit",
                fields: `('a${icp.value}','${site.value}','${email.value}',0)`
            });
            console.log(data)
        } else {
            if (json.fields[0].email == email.value) { } else {
                toast.warn("该备案号已注册", 2000)
            }
        }
    }
}

/**
 * 验证码
 * @param {object} json 
 * @param {string} path 
 * @param {Function} callback 
 */
function ajax(json, path, callback) {
    let pgjson = {};
    Object.keys(json).sort().forEach((value) => {
        pgjson[value] = json[value];
    });
    $.ajax("https://coco.codemao.cn/http-widget-proxy/https@SEP@api.pgaot.com/email/" + path, {
        method: "POST",
        data: JSON.stringify(json),
        headers: { "X-Pgaot-Token": SHA256(JSON.stringify(pgjson)).toUpperCase(), "Content-Type": "application/json;charset=UTF-8" },
        crossDomain: true,
        contentType: "application/json",
        success: (result) => {
            callback(JSON.parse(result))
        }
    }
    )
}