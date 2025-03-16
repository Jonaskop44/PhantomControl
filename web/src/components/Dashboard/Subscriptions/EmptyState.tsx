import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md overflow-hidden border-none bg-white shadow-xl">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          />
          <CardBody className="flex flex-col items-center gap-6 py-10 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-30" />
              <Icon
                icon="solar:sad-circle-bold"
                className="w-24 h-24 text-purple-500 relative z-10"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Kein aktives Abonnement
              </h2>
              <p className="text-gray-600 mb-6">
                Du hast derzeit kein aktives Abonnement. Entdecke unsere Pläne
                und genieße alle Premium-Funktionen.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  color="primary"
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 font-medium text-white shadow-lg"
                  startContent={
                    <Icon icon="solar:star-bold" className="w-5 h-5" />
                  }
                >
                  Pläne entdecken
                </Button>
              </motion.div>
            </motion.div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmptyState;
