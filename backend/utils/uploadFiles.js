const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);

const uploadFile = async (file, uploadFolderPath) => {
  try {
    if (!file) {
      throw new Error("No file provided.");
    }
    const extension = file.mimetype.split("/")[1];
    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(uploadFolderPath, fileName);
    await file.mv(filePath);
    return fileName;
  } catch (error) {
    console.error("Error processing file:", error);
    throw error; 
  }
};

const deleteFile = async (uploadFolderPath, profileImage) => {
  try {
    const deletePath = path.join(uploadFolderPath, profileImage);
    if (fs.existsSync(deletePath)) {
      await unlink(deletePath);
    } else {
      throw new Error("File not found.");
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

module.exports = { uploadFile, deleteFile };
