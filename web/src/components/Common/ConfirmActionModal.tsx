import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FC } from "react";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  useHandleConfirmAction: () => void;
  header: string;
  body: string;
}

const ConfirmActionModal: FC<ConfirmActionModalProps> = ({
  isOpen,
  onOpenChange,
  useHandleConfirmAction,
  header,
  body,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button color="danger" onPress={useHandleConfirmAction}>
            Delete Account
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmActionModal;
