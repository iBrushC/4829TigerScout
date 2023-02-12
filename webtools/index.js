// Globals
const generateQRFromData = () => {
    // Canvas and QRText
    const canvas = document.getElementById("QRcanvas");
    const qrText = document.getElementById("QRtext");
    const width = canvas.clientWidth;
    canvas.focus();

    // Getting inputs
    const bucketName = document.getElementById("QRbucketName").value;
    const bucketCloudConfig = document.getElementById("QRcloudConfig").value;
    const bucketSubpath = document.getElementById("QRsubpath").value;
    const bucketPermissions = document.getElementById("QReditorPermissions").checked ? "editor" : "reader";
    const bucketPassword = document.getElementById("QRpassword").value;

    // Cleanup for the cloud config
    let cleanedConfig = bucketCloudConfig.slice(
        bucketCloudConfig.indexOf("{"),
        bucketCloudConfig.indexOf("}") + 1,
    );
    // Regex wizardry https://stackoverflow.com/questions/9637517
    cleanedConfig = cleanedConfig
        .replace(/:\s*"([^"]*)"/g, function(match, p1) {
            return ': "' + p1.replace(/:/g, '@colon@') + '"';
        })
        .replace(/:\s*'([^']*)'/g, function(match, p1) {
            return ': "' + p1.replace(/:/g, '@colon@') + '"';
        })
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
        .replace(/@colon@/g, ':')

    // Error bars
    const errorBar = document.getElementById("QRerror");
    if (errorBar.style.transform != "scaleY(0)") {
        errorBar.style.transform = "scaleY(0)";
    }
    const showError = (message) => {
        errorBar.children[0].innerHTML = message;
        errorBar.style.transform = "scaleY(1)"
    }

    // Error checking
    if (bucketName.length === 0) {
        showError("Your bucket needs a name.");
        return;
    };
    if (bucketCloudConfig.length === 0) {
        showError("You need to fill in the cloud configuration.");
        return;
    }
    else {
        try {
            const jsonData = JSON.parse(cleanedConfig);
            const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
            if (JSON.stringify(Object.keys(jsonData)) !== JSON.stringify(requiredKeys)) {
                showError("Your cloud configuration doesn't contain the required values.");
                return;
            };
        } catch (e) {
            showError(`There was an error parsing your cloud config:\n\n${e}`);
            return;
        }
    }
    if (bucketPassword.length === 0) {
        showError("Your bucket needs a password.");
        return;
    };

    const bucketSettings = {
        bucketName: bucketName,
        cloudConfig: JSON.parse(cleanedConfig),
        subpath: bucketSubpath,
        permissions: bucketPermissions
    };

    // Generate codes
    const bucketCode = CryptoJS.AES.encrypt(JSON.stringify(bucketSettings), bucketPassword).toString();
    QRCode.toCanvas(
        canvas, 
        bucketCode,
        {
            width: width,
            errorCorrectionLevel: "M"
        }, 
        (e) => {
            if (e) console.error(e);
        }
    );
    qrText.innerHTML = bucketCode;

    // Download
    const qrDownload = document.getElementById("QRdownload");
    QRCode.toDataURL(
        bucketCode,
        {
            width: 2000,
            height: 2000,
            errorCorrectionLevel: "M"
        }, 
        (e, url) => {
            if (e) {
                console.error(e);
                return;
            }
            qrDownload.style.display = "block";
            qrDownload.href = url;
        }
    );
    
    return;
};