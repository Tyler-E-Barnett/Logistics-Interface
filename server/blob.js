const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

const { BlobServiceClient } = require("@azure/storage-blob");

async function uploadBlob(containerName, blobName, content) {
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(blobName);

  // Uploading the content to Azure Blob Storage
  await blobClient.upload(content, Buffer.byteLength(content));

  return blobClient.url;
}

async function getBlobUrlWithSas(containerName, blobName) {
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const blobClient = blobServiceClient
    .getContainerClient(containerName)
    .getBlobClient(blobName);

  // Generate SAS token for read access
  const sasToken = generateBlobSasToken(
    containerName,
    blobName,
    blobServiceClient
  );
  return `${blobClient.url}?${sasToken}`;
}

function generateBlobSasToken(containerName, blobName, blobServiceClient) {
  const {
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    StorageSharedKeyCredential,
  } = require("@azure/storage-blob");

  const accountName = blobServiceClient.accountName;
  const accountKey = connectionString.match(/AccountKey=([^;]+)/)[1];
  const credentials = new StorageSharedKeyCredential(accountName, accountKey);

  const sasOptions = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"),
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 86400 * 1000), // Valid for one day
  };

  const sasQueryParameters = generateBlobSASQueryParameters(
    sasOptions,
    credentials
  );
  return sasQueryParameters.toString();
}

async function main() {
  try {
    console.log("Azure Blob storage v12 - JavaScript quickstart sample");

    // Quick start code goes here

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName) throw Error("Azure Storage accountName not found");

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );
  } catch (err) {
    console.err(`Error: ${err.message}`);
  }
}

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.log(ex.message));
