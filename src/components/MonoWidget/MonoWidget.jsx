import React, { useContext, useEffect } from "react";
import MonoConnect from "@mono.co/connect.js";
import Button from "../Button/Button";
import { Context as MonoContext } from "../../context/MonoContext";
import { Context as AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";

export default function Mono() {
  const {
    state: { linkSuccess, error, monoStatus },
    authenticateUser,
    checkMonoStatus,
    resetLinkSuccess,
    clearErrors,
  } = useContext(MonoContext);
  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    checkMonoStatus(user.user_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(monoStatus);

  const monoConnect = React.useMemo(() => {
    const monoInstance = new MonoConnect({
      onClose: () => console.log("Widget closed"),
      onLoad: () => console.log("Widget loaded successfully"),
      onSuccess: ({ code }) => {
        console.log(`Linked successfully: ${code}`);
        authenticateUser(user.user_id, code);
      },
      // key: "test_pk_4f5soJVmo31hCbKePbfo",
      key: "live_pk_PvDfizVtAJPsoplNU8r2",
    });

    monoInstance.setup();

    return monoInstance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (linkSuccess) {
      toast.success("Your financial account has been successfully linked");
      resetLinkSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
      <ToastContainer position="top-center" />
      <Button
        className="mt-2"
        bgColor="#741763"
        size="lg"
        color="#EBEBEB"
        disabled={monoStatus === "active" ? true : false}
        clicked={() => monoConnect.open()}
      >
        {monoStatus === "active"
          ? `Account Linked`
          : `Link Your Financial Account`}
      </Button>
    </>
  );
}
