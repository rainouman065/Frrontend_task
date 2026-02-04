// src/components/AlertDialog.tsx
import type { FC } from "react";
import Swal from "sweetalert2";
import { Button } from "./ui/button";

const AlertDialog: FC = () => {
  const handleInfo = () => {
    void Swal.fire({
      title: "Heads up",
      text: "This is a simple informational alert powered by SweetAlert2.",
      icon: "info",
      confirmButtonText: "Got it",
      confirmButtonColor: "#2563eb",
    });
  };

  const handleConfirm = () => {
    void Swal.fire({
      title: "Publish selected articles?",
      text: "We will schedule the selected articles for publishing to WordPress.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, publish",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    }).then((result) => {
      if (result.isConfirmed) {
        void Swal.fire({
          title: "Scheduled",
          text: "Your articles have been queued for publishing.",
          icon: "success",
          confirmButtonText: "Nice",
          confirmButtonColor: "#16a34a",
        });
      }
    });
  };

  const handleWarning = () => {
    void Swal.fire({
      title: "Archive article?",
      text: "Archiving will remove the article from your active lists.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Archive",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#f97316",
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleInfo}
      >
        Info Alert
      </Button>
      <Button
        type="button"
        size="sm"
        variant="default"
        onClick={handleConfirm}
      >
        Confirm Dialog
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={handleWarning}
      >
        Warning Popup
      </Button>
    </div>
  );
};

export default AlertDialog;

