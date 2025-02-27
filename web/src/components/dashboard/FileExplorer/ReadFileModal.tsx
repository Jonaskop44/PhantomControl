import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { FC } from "react";

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
  console.log(`[ReadFileModal] Received content:`, content);
  console.log(`[ReadFileModal] Received fileType:`, fileType);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>File Content</ModalHeader>
        <ModalBody>
          {!content ? (
            <p>No content available</p>
          ) : fileType &&
            (fileType === "txt" || fileType.startsWith("text")) ? (
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {atob(content)}
            </pre>
          ) : fileType && fileType.startsWith("image") ? (
            <img
              src={`data:image/${fileType};base64,${content}`}
              alt="File content"
              style={{ width: "100%" }}
            />
          ) : fileType && fileType.startsWith("video") ? (
            <video controls style={{ width: "100%" }}>
              <source
                src={`data:video/${fileType};base64,${content}`}
                type={fileType}
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>Unsupported file type</p>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReadFileModal;
