export function exportResponseData(
  data: string,
  contentType: string,
  fileName: string
) {
  const downloadLink = window.document.createElement("a");
  downloadLink.href = window.URL.createObjectURL(
    new Blob([data], { type: contentType })
  );
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
