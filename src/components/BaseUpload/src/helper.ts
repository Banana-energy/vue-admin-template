export function formatFileSize(size: number,) {
  const kb = 1024
  const mb = kb * 1024
  let msg: string
  if (size < kb) {
    msg = `${size} B`
  } else if (size < mb) {
    msg = `${(size / kb).toFixed(2,)} KB`
  } else {
    msg = `${(size / mb).toFixed(2,)} MB`
  }
  return msg
}

export function validateFileType(file: File, accept?: string,) {
  if (!accept) {
    return true
  }
  const acceptArr = accept.split(",",)
  const type = file.name.split(".",).pop() || file.type || ""
  return acceptArr.some((item,) => {
    if (item === "image/*") {
      const imgExt = [
        "svgz",
        "pjp",
        "png",
        "ico",
        "avif",
        "tiff",
        "tif",
        "jfif",
        "svg",
        "xbm",
        "pjpeg",
        "webp",
        "jpg",
        "jpeg",
        "bmp",
        "gif",
      ]
      return imgExt.includes(type.toLowerCase(),)
    }
    if (item === "video/*") {
      const videoExt = [
        "mp4",
        "m4v",
        "mov",
        "mkv",
        "webm",
        "flv",
        "avi",
        "rmvb",
        "rm",
        "3gp",
        "3g2",
        "mpg",
        "mpeg",
        "wmv",
        "asf",
        "asx",
      ]
      return videoExt.includes(type.toLowerCase(),)
    }
    if (item === "audio/*") {
      const audioExt = ["mp3", "wav", "wma", "ogg", "flac", "ape", "aac", "amr", "m4a", "m4b", "wv",]
      return audioExt.includes(type.toLowerCase(),)
    }
    return item.toLowerCase() === `.${type.toLowerCase()}`
  },)
}
