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
import ApiClient from "@/api";
import { toast } from "sonner";
import { useHandleDeleteAccount } from "@/hooks/user";
import { useState } from "react";

const apiClient = new ApiClient();

const ProfileSettings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, clientKey, fetchUser, fetchClientKey } = userStore();
  const [username, setUsername] = useState<string>(user.username ?? "Guest");

  const createdAtDate = user.createdAt ? new Date(user.createdAt) : new Date();

  const copyApiKey = () => {
    if (clientKey.key) {
      navigator.clipboard.writeText(clientKey.key);
      toast.success("API key has been copied to clipboard.");
    } else {
      toast.error("API key is not available.");
    }
  };

  const resetApiKey = async () => {
    return apiClient.user.helper.resetClientKey().then((response) => {
      if (response.status) {
        fetchClientKey();
        toast.success("API key has been reset.");
      } else {
        toast.error("Failed to reset API key.");
      }
    });
  };

  const updateUser = async (username: string) => {
    return apiClient.user.helper.updateUser(username).then((response) => {
      if (response.status) {
        fetchUser();
        toast.success("Username has been updated.");
      } else {
        toast.error("Failed to update username.");
      }
    });
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
              onChange={(e) => setUsername(e.target.value)}
              defaultValue={username}
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
          <Button
            color="primary"
            type="submit"
            isDisabled={username === user.username}
            onPress={() => updateUser(username)}
          >
            Update Information
          </Button>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">API Key</h2>
          </CardHeader>
          <CardBody>
            <Input
              value={clientKey.key}
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
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Danger Zone</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Permanently delete your account and all associated data.
              </p>
              <Button color="danger" onPress={onOpen}>
                Delete Account
              </Button>
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-sm text-gray-500">
                Reset your API key. This will invalidate the current key and
                generate a new one.
              </p>
              <Button color="danger" onPress={resetApiKey}>
                Reset API Key
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

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
            <Button color="danger" onPress={useHandleDeleteAccount()}>
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileSettings;
