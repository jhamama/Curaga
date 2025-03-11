export async function uploadPhotoToS3(presignedUrl: string, file: Blob) {
  const myHeaders = new Headers({ "Content-Type": "image/jpeg" });
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: myHeaders,
    body: file,
  });

  if (!response.ok) throw new Error("Error uploading to S3");

  return new URL(response.url).href.split("?")[0];
}

export function dataURItoBlob(dataURI: string) {
  var binary = atob(dataURI.split(",")[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
}
