import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { FC } from "react";
import { Image } from "@heroui/react";

interface ReadFileModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  content: string | null;
  fileType: string | null;
}

const ReadFileModal: FC<ReadFileModalProps> = ({
  isOpen,
  onClose,
  content,
  fileType,
}) => {
  const fileExtension = fileType ? fileType.split("/").pop() : "";

  // Überprüfung auf Bildformate
  const isImage =
    fileExtension &&
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
      fileExtension.toLowerCase()
    );

  // Überprüfung auf Videoformate
  const isVideo =
    fileExtension &&
    ["mp4", "webm", "ogg", "avi", "mov", "mkv"].includes(
      fileExtension.toLowerCase()
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isImage ? "5xl" : isVideo ? "full" : "md"}
    >
      <ModalContent>
        <ModalHeader>File Content</ModalHeader>
        <ModalBody>
          {!content ? (
            <p>No content available</p>
          ) : isImage ? (
            <div className="flex justify-center items-center ">
              <Image
                src={`data:image/${fileExtension};base64,${content}`}
                alt="File content"
                isBlurred
                isZoomed
              />
            </div>
          ) : isVideo ? (
            // Für alle Videoformate
            <video controls style={{ width: "100%", borderRadius: "50%" }}>
              <source
                src={`data:video/${fileExtension};base64,${content}`}
                type={`video/${fileExtension}`}
              />
              Your browser does not support the video tag.
            </video>
          ) : fileExtension === "txt" ? (
            <p className="whitespace-pre-wrap break-words">{atob(content)}</p>
          ) : (
            <p>Unsupported file type</p>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReadFileModal;
