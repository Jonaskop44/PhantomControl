"use client";

import { Icon } from "@iconify/react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { userStore } from "@/data/userStore";

const ProfileSettings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = userStore();

  const createdAtDate = user.createdAt ? new Date(user.createdAt) : new Date();

  const handleDeleteAccount = async () => {
    console.log("Deleting account...");
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText("test");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Account Information</h1>
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex space-x-4">
            <Input
              label="Username"
              defaultValue={user.username}
              readOnly
              variant="bordered"
            />
            <Input
              label="Email"
              type="email"
              readOnly
              defaultValue={user.email}
              variant="bordered"
            />
          </div>
          <div className="flex space-x-4">
            <Input
              label="Role"
              value={user.role}
              isReadOnly
              variant="bordered"
            />
            <Input
              label="Account Created"
              value={createdAtDate.toLocaleDateString()}
              isReadOnly
              variant="bordered"
            />
          </div>
          <Button color="primary" type="submit" isDisabled>
            Update Information
          </Button>
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">API Key</h2>
        </CardHeader>
        <CardBody>
          <Input
            value={user.password}
            isReadOnly
            variant="bordered"
            classNames={{
              input:
                "font-mono [&:not(:focus)]:blur-sm transition-all duration-300",
            }}
            endContent={
              <Button isIconOnly variant="light" onClick={copyApiKey}>
                <Icon icon="mdi:content-copy" className="h-4 w-4" />
              </Button>
            }
          />
        </CardBody>
      </Card>

      <Button color="danger" onPress={onOpen}>
        Delete Account
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Are you absolutely sure?</ModalHeader>
          <ModalBody>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteAccount}>
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileSettings;
