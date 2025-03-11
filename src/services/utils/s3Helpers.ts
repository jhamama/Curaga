import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import axios from "axios";
import { text } from "stream/consumers";
import { createGunzip } from "zlib";

// Initialize the S3 client
const s3Client = new S3Client({});

export async function deleteObjectFromS3(
  bucketName: string,
  objectKey: string,
) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  try {
    const response = await s3Client.send(deleteCommand);
    console.log("Successfully deleted object", response);
    return response; // The response is typically empty for a successful deletion
  } catch (error) {
    console.error("Error deleting object:", error);
    throw error; // Rethrow or handle error appropriately
  }
}

export function extractBucketAndKeyFromS3Url(s3Url: string) {
  const url = new URL(s3Url); // Parse the URL

  let bucketName = "";
  let objectKey = "";

  // Path-style URL (https://s3.<region>.amazonaws.com/<bucket-name>/<key>)
  if (url.hostname.startsWith("s3.")) {
    // Extract bucket name from the path
    const pathParts = url.pathname.split("/");
    bucketName = pathParts[1]; // First part of the path is the bucket name
    objectKey = pathParts.slice(2).join("/"); // The rest is the object key
  }
  // Virtual-hosted-style URL (https://<bucket-name>.s3.<region>.amazonaws.com/<key>)
  else if (url.hostname.endsWith("amazonaws.com")) {
    bucketName = url.hostname.split(".")[0]; // Bucket name is the subdomain
    objectKey = url.pathname.slice(1); // The path after the first '/' is the object key
  }

  return { bucketName, objectKey };
}

interface UploadJsonToS3Params {
  bucketName: string;
  fileName: string;
  jsonString: string;
  makePublic?: boolean;
}

/**
 * Upload a JSON object to S3 and return the S3 URL.
 *
 * @param {UploadJsonToS3Params} params - The parameters for the upload.
 * @returns {Promise<string>} - The S3 URL of the uploaded file.
 */
export async function uploadJsonToS3(
  params: UploadJsonToS3Params,
): Promise<string> {
  const { bucketName, fileName, jsonString, makePublic = false } = params;

  // Convert the JSON object to a string
  const jsonContent = jsonString;

  // Prepare the S3 upload parameters
  const putObjectParams: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: fileName,
    Body: jsonContent,
    ContentType: "application/json", // Set the content type to JSON
  };

  if (makePublic) {
    putObjectParams.ACL = "public-read"; // Make the file publicly accessible
  }

  try {
    // Upload the file to S3 using the AWS SDK v3
    await s3Client.send(new PutObjectCommand(putObjectParams));

    // Construct the S3 URL
    const url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    console.log("File uploaded successfully:", url);

    return url;
  } catch (err) {
    console.error("Error uploading JSON to S3:", err);
    throw new Error("Failed to upload JSON to S3");
  }
}

export const fetchFromUrl = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching the object from S3:", error);
    throw new Error("Could not fetch the object from S3");
  }
};

export async function getObject(bucket: string, key: string) {
  const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(getObjectCommand);
  if (!response.Body) return null;
  const text = response.Body.transformToString();
  return text;
}
