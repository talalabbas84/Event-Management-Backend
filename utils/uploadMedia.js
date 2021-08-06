const fs = require("fs");
const { mapAsync } = require("lodasync");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
const ErrorResponse = require(`../utils/errorResponse`);
const path = require("path");

const uploadMedia = async (media, folderName) => {
  let result;

  media.name = `media_${uuidv4()}${path.parse(media.name).ext}`;
  let uploadLocation = path.resolve(process.env.FILE_UPLOAD_PATH + media.name);

  await fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(media.data))
  );
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      uploadLocation,
      {
        resource_type: media.mimetype.toString().includes("image")
          ? "image"
          : "video",
        folder: media.mimetype.toString().includes("image")
          ? `${folderName}/imagefiles`
          : `${folderName}/videofiles`,
        overwrite: true,
      },
      (error, result) => {
        if (error) return next(new ErrorResponse(error, 500));
        else {
          // Delete the temporary file from the server
          fs.unlink(uploadLocation, async (deleteErr) => {
            if (deleteErr) return next(new ErrorResponse(deleteErr, 500));
            result = result;
            resolve({
              res: result,
            });
          });
        }
      }
    );
  });
};

module.exports = uploadMedia;
