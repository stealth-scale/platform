/**
 * Shows the upload as a button and as a dropzone, with what has been picked listed under it.
 */

import { TrashIcon, UploadIcon } from "lucide-react";

import { Column, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Button, IconButton } from "#button/button.ts";
import {
  FileUploadContext,
  FileUploadDropzone,
  FileUploadDropzoneContent,
  FileUploadHiddenInput,
  FileUploadItem,
  FileUploadItemContent,
  FileUploadItemDeleteTrigger,
  FileUploadItemGroup,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemPreviewImage,
  FileUploadItems,
  FileUploadItemSizeText,
  FileUploadLabel,
  FileUploadRoot,
  FileUploadTrigger,
} from "#file-upload/file-upload.ts";

export const trigger: Scene = {
  about:
    "Nothing about an upload can be shown at rest, so the scene is the picking: pick a file and it appears under the button, with its size and a way to remove it again.",
  draw: () => (
    <FileUploadRoot colorPalette="primary" maxFiles={1}>
      <FileUploadHiddenInput />
      <FileUploadLabel>Statement</FileUploadLabel>
      <FileUploadTrigger asChild>
        <Button size="sm" variant="outline">
          <UploadIcon size={14} /> Pick a file
        </Button>
      </FileUploadTrigger>
      <FileUploadItemGroup>
        <FileUploadItems />
      </FileUploadItemGroup>
    </FileUploadRoot>
  ),
  title: "Behind a button",
};

export const dropzone: Scene = {
  about:
    "Drop images on it, or press it. The root lays its parts out from the start rather than stretching them, since the trigger is a button — so it is the dropzone that has to be told to take the width.",
  draw: () => (
    <Column width="lg">
      <FileUploadRoot accept="image/*" colorPalette="primary" maxFiles={4} width="full">
        <FileUploadHiddenInput />
        <FileUploadDropzone width="full">
          <FileUploadDropzoneContent>
            <UploadIcon size={20} />
            <Text>Drop images here, or press to pick them</Text>
            <Text muted size="xs">
              Up to four
            </Text>
          </FileUploadDropzoneContent>
        </FileUploadDropzone>

        <FileUploadItemGroup>
          <FileUploadContext>
            {(upload) =>
              upload.acceptedFiles.map((file) => (
                <FileUploadItem file={file} key={file.name}>
                  <FileUploadItemPreview>
                    <FileUploadItemPreviewImage />
                  </FileUploadItemPreview>
                  <FileUploadItemContent>
                    <FileUploadItemName />
                    <FileUploadItemSizeText />
                  </FileUploadItemContent>
                  <FileUploadItemDeleteTrigger asChild>
                    <IconButton aria-label="Remove" size="xs" variant="ghost">
                      <TrashIcon size={14} />
                    </IconButton>
                  </FileUploadItemDeleteTrigger>
                </FileUploadItem>
              ))
            }
          </FileUploadContext>
        </FileUploadItemGroup>
      </FileUploadRoot>
    </Column>
  ),
  title: "As a dropzone",
};

export default specimen({
  about:
    "Takes files by button or by dropping, and lists what has been picked. It draws no control of its own — the trigger is whatever it is given.",
  group: "Controls",
  id: "controls/file-upload",
  scenes: [trigger, dropzone],
  title: "File upload",
});
